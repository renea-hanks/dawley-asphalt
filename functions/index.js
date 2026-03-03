const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.processInquiry = functions.https.onCall(async (data, context) => {
    // Establishing the 31-year legacy in the response
    const legacyNote = "Since June 1, 1994, we have treated every surface as a capital asset.";

    const inquiryData = {
        name: data.name,
        location: data.location,
        message: data.message,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "PENDING_REVIEW"
    };

    try {
        // Saving the entry to your new Firebase Database
        await admin.firestore().collection('inquiries').add(inquiryData);

        return {
            success: true,
            response: `${legacyNote} Jerry Dawley has received your details and will review the engineering requirements for your project shortly.`
        };
    } catch (error) {
        console.error("Inquiry Error:", error);
        throw new functions.https.HttpsError('internal', 'The ledger is currently unavailable.');
    }
});