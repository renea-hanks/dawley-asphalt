// BOOK EXPANSION + PAGE FLIP

document.querySelectorAll(".book-container").forEach(book => {
    book.addEventListener("click", () => {
        const type = book.dataset.book;

        const pages = [
            "cover.jpg",
            "page-1.jpg",
            "page-2.jpg",
            "page-3.jpg",
            "page-4.jpg",
            "page-5.jpg",
            "page-6.jpg",
            "final.jpg"
        ];

        const container = document.createElement("div");
        container.classList.add("book-expanded");

        pages.forEach(page => {
            const img = document.createElement("img");
            img.src = `public/portfolio/${type}/${page}`;
            img.classList.add("book-page");
            container.appendChild(img);
        });

        container.addEventListener("click", () => container.remove());

        document.body.appendChild(container);
    });
});
