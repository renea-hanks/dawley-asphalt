const { onCall } = require("firebase-functions/v2/https");
const Anthropic = require("@anthropic-ai/sdk");
const nodemailer = require("nodemailer");
const https = require("https");

// Rate limiting store (in-memory, resets on cold start)
const submissionLog = {};

function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const maxSubmissions = 3;

    if (!submissionLog[ip]) {
        submissionLog[ip] = [];
    }

    submissionLog[ip] = submissionLog[ip].filter(t => now - t < windowMs);

    if (submissionLog[ip].length >= maxSubmissions) {
        return true;
    }

    submissionLog[ip].push(now);
    return false;
}

function verifyRecaptcha(token, secretKey) {
    return new Promise((resolve, reject) => {
        const postData = `secret=${secretKey}&response=${token}`;
        const options = {
            hostname: "www.google.com",
            path: "/recaptcha/api/siteverify",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error("Failed to parse reCAPTCHA response"));
                }
            });
        });

        req.on("error", reject);
        req.write(postData);
        req.end();
    });
}

// Simplified bot detection — only catches clear non-US bot signatures
function looksLikeBot(value, field) {
    if (!value || typeof value !== "string") return true;

    // Very specific bot email pattern only
    const suspiciousEmail = field === "email" && /[a-z]\.[a-z]\.[a-z]\.[a-z]\.[a-z]+\.\d+@/i.test(value);

    // Non-US country codes only
    const nonUSPhone = field === "phone" && /^(\+91|\+44|\+234|\+92|\+62|\+880|\+971)/.test(value.replace(/\s/g, ""));

    return suspiciousEmail || nonUSPhone;
}

// Rosie AI Assistant
exports.processInquiry = onCall({ secrets: ["ANTHROPIC_API_KEY"] }, async (request) => {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const msg = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: `You are Rosie, the technical assistant for Dawley Asphalt & Paving in Colorado Springs. Jerry Dawley has been paving since 1994 — his approach is geological integrity and quiet craftsmanship, not sales pressure.

YOUR ROLE:
You help property owners understand what they're dealing with technically. You ask smart questions, listen carefully, and translate their situation into a clear technical picture.

WHAT YOU KNOW:

Colorado Soil & Sub-base:
- Colorado Springs sits on expansive clay and decomposed granite (DG)
- Clay heave is the #1 cause of asphalt failure in this region — proper sub-base prep is non-negotiable
- Standard sub-base: 6-8" compacted Class 6 road base (crushed granite)
- Poor drainage accelerates failure — always assess slope, runoff, and proximity to irrigation

Asphalt Knowledge:
- Residential driveways: typically 3" compacted hot mix asphalt over proper base
- Commercial lots: 4" or more depending on load (delivery trucks, heavy equipment)
- Overlays: viable when existing base is sound — fails when laid over compromised sub-base
- Crack sealing: maintenance step, not a structural fix
- Seal coating: protects surface oxidation, typically every 3-5 years after cure
- Full replacement vs overlay: depends on base integrity, not just surface condition

Types of Work Jerry Does:
- Residential driveways (new installs and replacements)
- Commercial parking lots
- Sub-base excavation and grading
- Overlays
- Crack repair and seal coating
- Drainage correction

WHAT YOU DO NOT DO:
- Never provide quotes or price estimates
- If asked about cost, say: "Pricing- I'm glad you asked. That's why Jerry does free on-site consultations. I can help you understand what's likely involved technically before you meet with him."
- If the person seems ready to talk to Jerry or wants a consultation, say exactly this: "Click the Complimentary Consult button below to provide Dawley Asphalt with your details — Jerry will personally reach out to you."
- Do not book appointments or manage Jerry's calendar

YOUR TONE:
- Calm, knowledgeable, unhurried
- Ask one good question at a time
- Help them feel understood, not sold to
- Reflect Jerry's 30-year philosophy: the surface is the proof`,
            messages: request.data.messages,
        });

        return { text: msg.content[0].text };
    } catch (error) {
        console.error("ANTHROPIC_CONNECTION_ERROR:", error);
        return { text: "Something went wrong on our end. Please try again shortly." };
    }
});

// Contact Form Handler
exports.sendContactForm = onCall({ secrets: ["RECAPTCHA_SECRET_KEY", "GMAIL_APP_PASSWORD"] }, async (request) => {
    const { name, phone, email, projectType, message, recaptchaToken } = request.data;

    // 1. Verify reCAPTCHA token if present
    let recaptchaScore = "no-token";
    if (recaptchaToken) {
        let recaptchaResult;
        try {
            recaptchaResult = await verifyRecaptcha(recaptchaToken, process.env.RECAPTCHA_SECRET_KEY);
        } catch (err) {
            console.error("RECAPTCHA_VERIFY_ERROR:", err);
        }
        if (recaptchaResult && (!recaptchaResult.success || recaptchaResult.score < 0.5)) {
            console.warn("SUBMISSION_REJECTED: Low reCAPTCHA score", recaptchaResult.score);
            return { success: false, reason: "verification_failed" };
        }
        if (recaptchaResult) recaptchaScore = recaptchaResult.score;
    } else {
        console.warn("SUBMISSION_NOTE: No reCAPTCHA token — proceeding without verification");
    }

    // 2. Rate limiting by IP
    const ip = request.rawRequest?.ip || request.auth?.uid || "unknown";
    if (isRateLimited(ip)) {
        console.warn("SUBMISSION_REJECTED: Rate limited", ip);
        return { success: false, reason: "too_many_requests" };
    }

    // 3. Required field validation
    if (!name || !phone || !email || !projectType) {
        return { success: false, reason: "missing_fields" };
    }

    // 4. Bot pattern detection
    if (looksLikeBot(name, "name") || looksLikeBot(phone, "phone") || looksLikeBot(email, "email")) {
        console.warn("SUBMISSION_REJECTED: Bot pattern detected", { name, phone, email });
        return { success: true }; // Silent rejection
    }

    // 5. Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, reason: "invalid_email" };
    }

    // 6. Send the email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "asphaltpavingservices@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Dawley Asphalt Website" <asphaltpavingservices@gmail.com>',
        to: "dawleyasphalt@yahoo.com",
        subject: `New Project Request — ${projectType}`,
        html: `
            <h2 style="font-family:sans-serif;">New Project Request</h2>
            <table style="font-family:sans-serif; font-size:15px; line-height:2;">
                <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td><strong>Project Type:</strong></td><td>${projectType}</td></tr>
                <tr><td><strong>Message:</strong></td><td>${message || "No message provided"}</td></tr>
                <tr><td><strong>reCAPTCHA Score:</strong></td><td>${recaptchaScore}</td></tr>
            </table>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("MAIL_SENT:", { name, email, projectType });
        return { success: true };
    } catch (error) {
        console.error("MAIL_ERROR:", error);
        return { success: false, reason: "mail_error" };
    }
});