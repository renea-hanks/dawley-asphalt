function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1'; // Force visibility
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal(event.target.id);
    }
}