// This script handles the interaction between the form and the Firebase Function
async function handleInquiry(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value;
    const location = document.getElementById('userLocation').value;
    const message = document.getElementById('userMessage').value;
    const btn = event.target.querySelector('button');

    btn.innerText = "CONSULTING...";
    btn.disabled = true;

    try {
        const processInquiry = firebase.functions().httpsCallable('processInquiry');
        const result = await processInquiry({ name, location, message });
        
        alert(result.data.response);
        document.getElementById('inquiryForm').reset();
    } catch (error) {
        console.error("Submission error:", error);
        alert("The Principal is currently in the field. Please try again later.");
    } finally {
        btn.innerText = "SUBMIT TO PRINCIPAL";
        btn.disabled = false;
    }
}

// Attach the listener once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inquiryForm');
    if (form) {
        form.addEventListener('submit', handleInquiry);
    }
});