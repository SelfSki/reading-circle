
const MAX_RATING = 5;

/*==========================================
    Rendering export functions
==========================================*/

export function createBookStatus(book, index, isAdmin) {
    if (book.status === "currently-reading") {
        return `
           <div class="progress-container">

                <div class="progress-header">
                   <span>Progress</span>
                    <span>${book.progress}%</span>
                </div>

                <div
                    <div
                    class="progress-bar ${isAdmin ? "edit-progress admin-editable" : ""}"
                    data-index="${index}"
                >
                    <div
                        class="progress-fill"
                        style="width:${book.progress}%"
                    ></div>
                </div>
                
            </div>
        `;
    }

    if (book.status === "finished") {
        return `
            <div
                class="book-rating ${isAdmin ? "edit-rating admin-editable" : ""}"
                data-index="${index}"
            >
            <span class="rating-stars">
                ${createStars(book.rating)}
            </span>

            <span class="rating-text">
                ${book.rating === 0
                    ? "Rate"
                    :`${book.rating}/5`       
                } 
            </span>
            </div>
        `;
    }
    return "";
} // ← createBookStatus ENDS HERE


function createStars(rating) {
    let stars = "";
    for (let i = 1; i <= MAX_RATING; i++) {
        stars += `
            <span class="${
                i <= rating
                    ? "star filled"
                    : "star empty"
            }">
                ★
            </span>
        `;
    }
    return stars;
} // Create Stars


export function createBookCard(book, index, isAdmin) {
    console.log("createBookCard isAdmin:", isAdmin);
       const shortDescription = truncateDescription(book.description,70);
    return `
    <div class="book-card"
        data-index="${index}">
        <img 
            src="${book.cover}"
            alt="${book.title}"
            loading="lazy"
          >
        <div class="book-info">
        <div class="book-header">
            <div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class = "book-description">${shortDescription}</p>
            </div>
            
           ${isAdmin ? `
            <div class="book-actions">

                <button
                    class="edit-book-button"
                    data-index="${index}"
                >
                    ✏️
                </button>

                <button
                    class="delete-book-button"
                    data-index="${index}"
                >
                    🗑️
                </button>

            </div>
            ` : ""}
        </div>
        ${createBookStatus(book,index, isAdmin)}
        </div>
    </div>
    `;
} // ← createBookCard ENDS HERE


export function createShelf(shelf, isAdmin) {
    return `
    <section class="shelf ${shelf.color}">
            <div class="shelf-header">
                <h2 class="shelf-title"> ${shelf.title}</h2>

                ${isAdmin ? `
                <button
                    class="add-book-button"
                    data-status="${shelf.status}"
                >
                    + Add Book
                </button>
                ` : ""}
            </div>

            <div
                id="${shelf.status}"
                class="book-shelf"
            ></div>
        </section>
    `;
}// ← creatshelf ENDS HERE


export function renderShelf(shelfElement,  status, books, isAdmin) {
    shelfElement.innerHTML = "";
    const shelfBooks = books.filter(book => book.status === status);
    if (shelfBooks.length === 0) {
        shelfElement.innerHTML = `
            <p class="empty-shelf">
                Nothing here.
            </p>
        `;
        return;
    }

    for (const book of shelfBooks) {
        const index = books.indexOf(book);
        shelfElement.innerHTML += createBookCard(book, index, isAdmin);
    }
}



export function renderLibrary(library, books, shelves, isAdmin) {
    library.innerHTML = "";
    for (const shelf of shelves) {
        // Step 1: Create the shelf HTML
        library.innerHTML += createShelf(shelf, isAdmin);
        // Step 2: Find the shelf we just created
        const shelfElement = document.getElementById(shelf.status);
        // Step 3: Fill it with books
        renderShelf(shelfElement, shelf.status, books, isAdmin);
    }
}



export function truncateDescription(text, maxLength = 70) {
    if (!text) {
        return "";
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
}