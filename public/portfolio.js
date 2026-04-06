/**
 * DAWLEY ASPHALT PORTFOLIO LOGIC
 * Hand-coded for Volume I & II Ledger Functionality
 */

// Global function to open the ledger
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.zIndex = '20005';
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
        document.body.style.overflow = 'auto';
        console.log("Ledger Closed: " + modalId);
    }
};

// Close when clicking the dark background overlay
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        const openModalId = event.target.id;
        window.closeModal(openModalId);
    }
});

// Commercial featured images → main blog
document.querySelectorAll('.record-col:first-child .portrait-frame img').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        window.open('https://dawleyasphalt.blog/', '_blank');
    });
});

// Private Estates featured images → private estates page
document.querySelectorAll('.record-col:last-child .portrait-frame img').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        window.open('https://dawleyasphalt.blog/project-portfolio-private-estates/', '_blank');
    });
});

// View More Projects → main blog
document.querySelector('.outline-btn').addEventListener('click', function() {
    window.open('https://dawleyasphalt.blog/', '_blank');
});