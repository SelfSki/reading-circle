
/* ==========================================
   Storage
========================================== */

export function loadBooks() {
    const savedBooks = localStorage.getItem("books");
    if (!savedBooks) {
        return [];  
    }
    return JSON.parse(savedBooks);
}

/* ==========================================
   Book Operations
========================================== */

export function saveBooks(books) {
    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );
}
