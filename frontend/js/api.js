
const API_BASE_URL = "http://localhost:3000";


export async function fetchBooks() {
    const response =
        await fetch(
            `${API_BASE_URL}/books`
        );
    if (!response.ok) {
        throw new Error(
            "Unable to fetch books"
        );
    }
   const books = await response.json();
        const statusMap = {
            "WANT_TO_READ": "repository",
            "READING": "currently-reading",
            "FINISHED": "finished"
        };

        return books.map(book => ({
            ...book,
            status: statusMap[book.status],
            cover: book.cover_url
        }));
}


export async function saveBook(book) {
    const response = await fetch(
            `${API_BASE_URL}/books`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(book)
            }
        );
    if (!response.ok) {
        throw new Error(
            "Unable to save book"
        );
    }
    return await response.json();
}

export async function createBook(book) {
    const response =
        await fetch(
            `${API_BASE_URL}/books`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(book)
            }
        );
    if (!response.ok) {
        throw new Error(
            "Unable to create book"
        );
    }
    return await response.json();
}


export async function deleteBook(bookId) {
    const response =
        await fetch(
            `${API_BASE_URL}/books/${bookId}`,
            {
                method: "DELETE"
            }
        );
    if (!response.ok) {
        throw new Error(
            "Unable to delete book"
        );
    }
}



export async function updateBook(book) {
    const response =
        await fetch(
            `http://localhost:3000/books/${book.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: book.status,
                    progress: book.progress,
                    rating: book.rating
                })
            }
        );
    if (!response.ok) {
        throw new Error(
            "Unable to update book."
        );
    }
}