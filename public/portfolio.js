/**
 * DAWLEY ASPHALT PORTFOLIO LOGIC
 * Hand-coded for Volume I & II Ledger Functionality
 */

// Global function to open the ledger
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        // 1. Force layout to flex for centering
        modal.style.display = 'flex';
        
        // 2. Force visibility (bypassing any CSS opacity issues)
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        
        // 3. Ensure it sits above Rosie and Navigation
        modal.style.zIndex = '20005';
        
        // 4. Lock the background scroll
        document.body.style.overflow = 'hidden';
        
        console.log("Ledger Opened: " + modalId);
    } else {
        console.error("Modal ID not found: " + modalId);
    }
};

// Global function to close the ledger
window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        
        // Restore background scroll
        document.body.style.overflow = 'auto';
        
        console.log("Ledger Closed: " + modalId);
    }
};

// Close when clicking the dark background overlay
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        // Detect which modal is open by its ID
        const openModalId = event.target.id;
        window.closeModal(openModalId);
    }
});