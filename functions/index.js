const { onCall } = require("firebase-functions/v2/https");
const Anthropic = require("@anthropic-ai/sdk");

exports.processInquiry = onCall({ secrets: ["ANTHROPIC_API_KEY"] }, async (request) => {
    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            system: "You are Rosie, an expert engineering assistant for Dawley Asphalt. Provide technical, high-level responses regarding Colorado soil (clay mitigation, granitic sub-base) and Jerry's 30-year paving legacy.",
            messages: [{ role: "user", content: request.data.text }],
        });

        return { text: msg.content[0].text };
    } catch (error) {
        // Log the actual error for the developer to see in Firebase Console
        console.error("ANTHROPIC_CONNECTION_ERROR:", error);
        return { text: "TECHNICAL ERROR: Backend unable to verify security credentials." };
    }
});