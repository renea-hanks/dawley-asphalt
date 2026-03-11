// LANDSCAPE FLIPBOOK WITH REAL BOOK PAGE TURN

const BOOK_PAGES = {
    commercial: [
        "cover.jpg",
        "page-1.jpg",
        "page-2.jpg",
        "page-3.jpg",
        "page-4.jpg",
        "page-5.jpg",
        "page-6.jpg",
        "final.jpg"
    ],
    private: [
        "cover.jpg",
        "page-1.jpg",
        "page-2.jpg",
        "page-3.jpg",
        "page-4.jpg",
        "page-5.jpg",
        "page-6.jpg",
        "final.jpg"
    ]
};

const overlay = document.getElementById("book-overlay");
const pageImage = document.getElementById("book-page-image");
const pageIndicator = document.getElementById("book-page-indicator");
const btnPrev = document.getElementById("book-prev");
const btnNext = document.getElementById("book-next");
const btnClose = document.getElementById("book-close");

let currentBook = null;
let currentIndex = 0;
const FLIP_DURATION = 600; // ms, matches CSS 0.6s

function renderPage() {
    if (!currentBook) return;
    const pages = BOOK_PAGES[currentBook];
    const filename = pages[currentIndex];

    pageImage.src = `portfolio/${currentBook}/${filename}`;
    pageIndicator.textContent = `Page ${currentIndex + 1} of ${pages.length}`;

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === pages.length - 1;
}

function openBook(bookKey) {
    currentBook = bookKey;
    currentIndex = 0;
    renderPage();
    overlay.classList.add("active");
}

function closeBook() {
    overlay.classList.remove("active");
    currentBook = null;
}

// Flip with real book animation: right page turns left on next, left page turns right on prev
function flipPage(direction) {
    if (!currentBook) return;

    const pages = BOOK_PAGES[currentBook];
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= pages.length) return;

    const animClass = direction > 0 ? "turning-next" : "turning-prev";

    pageImage.classList.add(animClass);

    setTimeout(() => {
        currentIndex = newIndex;
        renderPage();
    }, FLIP_DURATION / 2);

    setTimeout(() => {
        pageImage.classList.remove(animClass);
    }, FLIP_DURATION);
}

// Attach click handlers to book cards
document.querySelectorAll(".book-card").forEach(card => {
    card.addEventListener("click", () => {
        const bookKey = card.dataset.book;
        if (BOOK_PAGES[bookKey]) {
            openBook(bookKey);
        }
    });
});

// Navigation buttons
btnPrev.addEventListener("click", () => {
    flipPage(-1);
});

btnNext.addEventListener("click", () => {
    flipPage(1);
});

// Close button and overlay click
btnClose.addEventListener("click", closeBook);
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        closeBook();
    }
});
