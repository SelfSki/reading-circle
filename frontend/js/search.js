

/* ==========================================
   Open Library Service
========================================== */

export async function searchBooks(query) {
    const response = await fetch(
         `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.docs || [];
}


export async function fetchBookDetails(workKey) {
    const response = await fetch(
        `https://openlibrary.org${workKey}.json`
    );
    return await response.json();
}


export function normalizeBook(book) {
    return {
        title: book.title,
        author: book.author_name?.[0] || "Don't know who wrote!",
        cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "https://placehold.co/200x300?text=No+Cover",
        description:
            book.first_sentence
                ? book.first_sentence
                : "Nothing's here",
        source: book
    };
}

