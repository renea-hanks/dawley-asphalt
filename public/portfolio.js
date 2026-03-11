// Simple Modal Logic for the Ledgers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    // Small delay to allow display:flex to apply before changing opacity for a fade effect
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    
    // Wait for the fade out transition before hiding completely
    setTimeout(() => {
        modal.style.display = 'none';
        // Restore background scrolling
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal if user clicks outside the content area
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});