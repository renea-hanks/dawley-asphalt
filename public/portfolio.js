function initBook(bookId) {
    const book = document.getElementById(bookId);
    const pages = book.querySelectorAll('.page');
    let current = 0;

    book.addEventListener('click', () => {
        if (current < pages.length - 1) {
            pages[current].style.transform = "rotateY(-180deg)";
            current++;
        }
    });
}

initBook('commercialBook');
initBook('privateBook');
