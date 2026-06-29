/* ==========================================
   Configuration
========================================== */

const shelves = [
    {
        title: "📖 Currently Reading",
        status: "currently-reading",
        color: "reading"
    },
    {
        title: "✅ Finished",
        status: "finished",
        color: "finished"
    },
    {
        title: "📚 Repository",
        status: "repository",
        color: "repository"
    }
];

/* ==========================================
   DOM Elements
========================================== */

/* ==========================================
   Application
========================================== */

const library = document.getElementById("library");
const settingsButton = document.getElementById("settingsButton");
const appTitle = document.getElementById("appTitle");

/* ==========================================
   Settings Modal
========================================== */

const modalOverlay = document.getElementById("modalOverlay");
const appNameInput = document.getElementById("appNameInput");
const cancelButton = document.getElementById("cancelButton");
const saveButton = document.getElementById("saveButton");

/* ==========================================
   Add Book Modal
========================================== */

const addBookModal = document.getElementById("addBookModal");
const cancelBookButton = document.getElementById("cancelBookButton");
const saveBookButton = document.getElementById("saveBookButton");
const bookSearchInput = document.getElementById("bookSearchInput");
const searchBookButton = document.getElementById("searchBookButton");
const searchResults = document.getElementById("searchResults");
const selectedBookPreview = document.getElementById("selectedBookPreview");

/* ==========================================
   Application State
========================================== */

let selectedShelf = "";
let selectedBook = null;
let searchBooksResult = [];
let selectedBookIndex = null;
let editingBookIndex = null;
const MAX_PROGRESS = 100;
const MAX_RATING = 5;

/* ==========================================
   Storage
========================================== */

function loadBooks() {
    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
        books.length = 0;
        books.push(...JSON.parse(savedBooks));
    }
}

/* ==========================================
   Book Operations
========================================== */

function saveBooks() {
    localStorage.setItem(
        "books",
        JSON.stringify(books)
    );
}


/*==========================================
    Rendering Functions
==========================================*/

function createBookStatus(book, index) {
    if (book.status === "currently-reading") {
        return `
           <div class="progress-container">

                <div class="progress-header">
                   <span>Progress</span>
                    <span>${book.progress}%</span>
                </div>

                <div
                    class="progress-bar edit-progress"
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
                class="book-rating edit-rating"
                data-index="${index}"
            >
            <span class="rating-stars">
                ${"★".repeat(book.rating)}
                ${"☆".repeat(MAX_RATING-book.rating)}
            </span>
            
            <span class="rating-text">
                ${book.rating === 0
                    ? "Rate me"
                    :`${book.rating}/5`       
                } 
            </span>
            </div>
        `;
    }
    return "";
} // ← createBookStatus ENDS HERE


function createBookCard(book, index) {
       const shortDescription = truncateDescriptionWords(book.description,10);
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
        </div>
        ${createBookStatus(book,index)}
        </div>
    </div>
    `;
} // ← createBookCard ENDS HERE


function createShelf(shelf) {
    return `
    <section class="shelf ${shelf.color}">
            <div class="shelf-header">
                <h2 class="shelf-title"> ${shelf.title}</h2>

                <button
                    class="add-book-button"
                    data-status="${shelf.status}"
                >
                    + Add Book
                </button>
            </div>

            <div
                id="${shelf.status}"
                class="book-shelf"
            ></div>
        </section>
    `;
}// ← creatshelf ENDS HERE

function renderShelf(shelfElement, status) {
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
        shelfElement.innerHTML += createBookCard(book, index);
    }
}


/* ==========================================
   Settings Modal
========================================== */

function openSettingsModal() {
    appNameInput.value = appTitle.textContent.replace("📚 ", "");
    modalOverlay.classList.remove("modal-hidden");
    appNameInput.focus();
    appNameInput.setSelectionRange(
        0,
        appNameInput.value.length
    );
}

function closeSettingsModal() {
    modalOverlay.classList.add("modal-hidden");
}

function saveSettings() {
    appTitle.textContent = "📚 " + appNameInput.value;
    closeSettingsModal();
}

function handleKeyPress(event){
    if(event.key !== "Escape"){
        return;
    }

    if(!modalOverlay.classList.contains("modal-hidden")){
        closeSettingsModal();
    }

    if(!addBookModal.classList.contains("modal-hidden")){
        closeAddBookModal();
    }
}

/*================================================
 Refreshing Library
================================================*/

function refreshLibrary() {
    saveBooks();
    renderLibrary();
}

/*=============================================
Add Book function Modal
Adds books in the Shelves
==============================================*/

function openAddBookModal(status){
    editingBookIndex = null;
    selectedShelf = status;
    selectedBook = null;
    saveBookButton.disabled = true;

    bookSearchInput.value = "";
    searchResults.innerHTML = "";
    selectedBookPreview.innerHTML = "";

    saveBookButton.textContent = "Let's pick it";
    addBookModal.classList.remove("modal-hidden");
    bookSearchInput.focus();
}

/*
function openEditBookModal(index) {
    editingBookIndex = index;
    const book = books[index];
    selectedShelf = book.status;
    bookTitleInput.value = book.title;
    bookAuthorInput.value = book.author;
    bookCoverInput.value = book.cover;
    saveBookButton.textContent = "Save Changes";
    addBookModal.classList.remove("modal-hidden");
    bookTitleInput.focus();
}
*/

function openEditBookModal(index) {
    alert("Editing will be available at a later stage.");
}


function closeAddBookModal(){
    selectedBook = null;
    selectedBookIndex = null;
    searchResults.innerHTML = "";
    selectedBookPreview.innerHTML = "";
    bookSearchInput.value = "";
    addBookModal.classList.add("modal-hidden");
}

/*----------------------------------------------------------------*/

function saveBook() {

    if (!selectedBook) {
        alert("Please select a book.");
        return;
    }

    if (editingBookIndex === null) {
        const newBook = {
            title: selectedBook.title,
            author: selectedBook.author,
            cover: selectedBook.cover,
            description: selectedBook.description,
            status: selectedShelf
        };

        if (selectedShelf === "currently-reading") {
            newBook.progress = 0;
        }

        if (selectedShelf === "finished") {
            newBook.rating = 0;
        }
        books.push(newBook);
    } else {
        books[editingBookIndex].title = selectedBook.title;
        books[editingBookIndex].author = selectedBook.author;
        books[editingBookIndex].cover = selectedBook.cover;
        books[editingBookIndex].description = selectedBook.description;
    }
    refreshLibrary();
    closeAddBookModal();
}


/*----------------------------------------------------------------*/

function deleteBook(index) {

    const confirmed = confirm(
         `Delete "${books[index].title}"?`
    );

    if (!confirmed) {
        return;
    }
    books.splice(index, 1);
    refreshLibrary()
}


function editProgress(index){
    const newProgress = Number(
        prompt(
            "Reading Progress (0-100)",
            books[index].progress
        )
    );
    if(isNaN(value) || value < 0 || value > MAX_PROGRESS){
        return;
    }
    books[index].progress = value;
    refreshLibrary();
}


function editRating(index){
    const newRating = Number(
        prompt(
            "Rating (1-5)",
            books[index].rating
        )
    );
    if(isNaN(newRating) || newRating < 0 || newRating > MAX_RATING){
        return;
    }
    books[index].rating = newRating;
    refreshLibrary();
}

function renderLibrary() {
    library.innerHTML = "";
    for (const shelf of shelves) {
        // Step 1: Create the shelf HTML
        library.innerHTML += createShelf(shelf);
        // Step 2: Find the shelf we just created
        const shelfElement = document.getElementById(shelf.status);
        // Step 3: Fill it with books
        renderShelf(shelfElement, shelf.status);
    }
}


/* ==========================================
   Open Library Service
========================================== */

async function searchBooks(query) {
    const response = await fetch(
         `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.docs || [];
}


async function fetchBookDetails(workKey) {
    const response = await fetch(
        `https://openlibrary.org${workKey}.json`
    );
    return await response.json();
}


function normalizeBook(book) {
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



function createSearchResultCard(book, index) {
    const selectedClass = index === selectedBookIndex? "selected": "";
    return `
        <div
            class="search-result-card ${selectedClass}"
            data-index="${index}"
        >
            <img
                src="${book.cover}"
                alt="${book.title}"
                loading="lazy"
            >
            <div class="search-result-info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            </div>
        </div>
    `;
}



function renderSearchResults(results){
    if(results.length === 0){
        searchResults.innerHTML = `
            <div class="search-empty">
                <p> Sorry bud, it isn't there.</p>
                <p>Wanna try again?</p>
            </div>
        `;
        return;
    }
    searchResults.innerHTML = `
    <p class="search-count">
        Found ${results.length} book${results.length === 1 ? "" : "s"}
    </p>
    `;
    searchResults.innerHTML +=
        results
            .map(createSearchResultCard)
            .join("");
}



async function selectBook(index){
    selectedBookIndex = index;
    selectedBook = searchBooksResult[index];
    if (selectedBook.source.key) {
        const details =
            await fetchBookDetails(
                selectedBook.source.key
            );
        if (details.description) {
            if (
                typeof details.description === "string"
            ) {
                selectedBook.description =
                    details.description;
            } else {
                selectedBook.description =
                    details.description.value;
            }
        }
    }
    renderSearchResults(searchBooksResult);
    renderSelectedBook();
    saveBookButton.disabled = false;
    searchResults.innerHTML = "";
}



function truncateDescriptionWords(description, maxWords = 30) {
/*const shortDescription = book.description,maxWords =50;*/
    if (!description) return "No description available.";
    const words = description.trim().split(/\s+/);
    if (words.length <= maxWords) {
        return description;
    }
    return words.slice(0, maxWords).join(" ") + "...";
}



function renderSelectedBook(){
    const shortDescription = truncateDescriptionWords(selectedBook.description || "No Description Available",
            30);
    selectedBookPreview.innerHTML = `
        <div class="selected-book-card">
            <img
                src="${selectedBook.cover}"
                alt="${selectedBook.title}"
                loading="lazy"
            >
            <div>
                <h3>${selectedBook.title}</h3>
                <p>${selectedBook.author}</p>
                <h4>ABout this book</h4>
                <p class="selected-book-description">
                ${shortDescription}
                </p>
                <p class="selected-book-ready">
                That's a Good one!
                </p>
            </div>
        </div>
    `;
}


/* ==========================================
   Event Listeners
========================================== */

settingsButton.addEventListener("click", openSettingsModal);
cancelButton.addEventListener("click", closeSettingsModal);
saveButton.addEventListener("click", saveSettings);
document.addEventListener("keydown", handleKeyPress);
library.addEventListener("click", function (event) {
    const addButton = event.target.closest(".add-book-button");
    if (addButton) {
        openAddBookModal(addButton.dataset.status);
        return;
    }

    const editButton = event.target.closest(".edit-book-button");
    if (editButton) {
        openEditBookModal(Number(editButton.dataset.index));
        return;
    }
    
    const deleteButton = event.target.closest(".delete-book-button");
    if (deleteButton) {
        deleteBook(Number(deleteButton.dataset.index));
        return;
    }
    
    const progressBar = event.target.closest(".edit-progress");
    if (progressBar) {
        editProgress(Number(progressBar.dataset.index));
        return;
    }
       
    const ratingButton = event.target.closest(".edit-rating");
    if (ratingButton) {
        editRating(Number(ratingButton.dataset.index));
    }
});

cancelBookButton.addEventListener("click", closeAddBookModal);
saveBookButton.addEventListener("click", saveBook);
modalOverlay.addEventListener("click", function(event){
    if(event.target === modalOverlay){
        closeSettingsModal();
    }
});

addBookModal.addEventListener("click", function(event){
    if(event.target === addBookModal){
        closeAddBookModal();
    }
});


searchBookButton.addEventListener(
    "click",
    async function(){
        const query = bookSearchInput.value.trim();
        if (query === "") {
            bookSearchInput.focus();
            return;
        }
      searchResults.innerHTML = `
            <p class="search-message">
                Looking around...
            </p>
        `;
        const results =
            await searchBooks(query)
        searchBooksResult =
            results.map(normalizeBook);

        renderSearchResults(
            searchBooksResult
        );
    }
);

bookSearchInput.addEventListener(
    "keydown",
    function(event){
        if(event.key === "Enter"){
            searchBookButton.click();
        }
    }
);

searchResults.addEventListener(
    "click",
    function(event){
        const card =
            event.target.closest(".search-result-card");
        if(!card){
            return;
        }
        const index =
            Number(card.dataset.index);
        selectBook(index);
    }
);


/* ==========================================
   Application Initilization
========================================== */
loadBooks();
renderLibrary();
/* End of Functions */