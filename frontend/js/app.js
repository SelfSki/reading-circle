
/*======================================
Importing functions from different files (ES Modules)
=======================================*/

/*library.js*/

import {
    renderLibrary,
    truncateDescription
}
from "./library.js";

import {
    saveBooks
}
from "./storage.js";

import {
    searchBooks,
    fetchBookDetails,
    normalizeBook
}
from "./search.js";

import {
    fetchBooks,
    createBook,
    deleteBook as deleteBookFromBackend,
    updateBook
}
from "./api.js";



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
   Application State
========================================== */

let books = [];
let selectedShelf = "";
let selectedBook = null;
let searchBooksResult = [];
let selectedBookIndex = null;
let editingBookIndex = null;
let isAdmin = localStorage.getItem("isAdmin") === "true";


/* ==========================================
   Application
========================================== */

const library = document.getElementById("library");
const settingsButton = document.getElementById("settingsButton");
const adminButton = document.getElementById("adminButton");
if(isAdmin){
    adminButton.textContent = "👑";
}
settingsButton.style.display = isAdmin ? "block" : "none";
const appTitle = document.getElementById("appTitle");

adminButton.textContent = isAdmin ? "👑" : "🔒";
settingsButton.style.display = isAdmin ? "block" : "none";


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
const MAX_PROGRESS = 100;
const MAX_RATING = 5;


/* ==========================================
   Event Listeners
========================================== */


settingsButton.addEventListener("click", openSettingsModal);
adminButton.addEventListener("click", authenticateAdmin);

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
                Searching around...
            </p>
        `;
        const results =
            await searchBooks(query)
  
            const normalizedBooks =
            results.map(normalizeBook);

            searchBooksResult = normalizedBooks;
            renderSearchResults(searchBooksResult);
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




/*----------------------------------------------------------------*/

/*================================================
 Refreshing Library
================================================*/


function refreshLibrary() {
    saveBooks(books);
    renderLibrary(library, books, shelves, isAdmin);

}


async function saveBook() {
    if (!selectedBook) {
        alert("Please select a book.");
        return;
    }

    if (editingBookIndex === null) {
      const newBook = {

                title:
                    selectedBook.title,

                author:
                    selectedBook.author,

                cover:
                    selectedBook.cover,

                description:
                    selectedBook.description,

                status:
                    selectedShelf

            };

            try {
                await createBook(newBook);
                const databaseBooks = await fetchBooks();
                books.length = 0;
                books.push(...databaseBooks);
                refreshLibrary();
                closeAddBookModal();
                return;

            }
            catch(error){
                console.error(error);
                alert(
                    "Unable to save book."
                );

                return;

            }
    } else {
        books[editingBookIndex].title = selectedBook.title;
        books[editingBookIndex].author = selectedBook.author;
        books[editingBookIndex].cover = selectedBook.cover;
        books[editingBookIndex].description = selectedBook.description;
    }
}


/*----------------------------------------------------------------*/

async function deleteBook(index) {
    const confirmed =
        confirm(
            `Delete "${books[index].title}"?`
        );
    if (!confirmed) {
        return;
    }
    try {
        await deleteBookFromBackend(
            books[index].id
        );
        const databaseBooks =
            await fetchBooks();
        books.length = 0;
        books.push(
            ...databaseBooks
        );
        refreshLibrary();
    }
    catch (error) {
        console.error(error);
        alert(
            "Unable to delete book."
        );
    }
}

async function editProgress(index){
    const newProgress = Number(
        prompt(
            "Reading Progress (0-100)",
            books[index].progress
        )
    );
    if(isNaN(newProgress) || newProgress < 0 || newProgress > MAX_PROGRESS){
        return;
    }
    books[index].progress = newProgress;
        try {
            await updateBook(
                books[index]
            );
            const databaseBooks =
                await fetchBooks();
            books.length = 0;
            books.push(
                ...databaseBooks
            );
            refreshLibrary();
        }
        catch(error){
            console.error(error);
            alert(
                "Unable to update progress."
            );
        }
}


async function editRating(index){
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
    try {
        await updateBook(
            books[index]
        );
        const databaseBooks =
            await fetchBooks();
        books.length = 0;
        books.push(
            ...databaseBooks
        );
        refreshLibrary();
    }
    catch(error){
        console.error(error);
        alert(
            "Unable to update rating."
        );
    }
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



function renderSelectedBook(){
    const shortDescription = truncateDescription(selectedBook.description || "No Description Available",
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


/*=============================================
Add Book export function Modal
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
}*/

function openEditBookModal(index) {
    alert("Editing will be available at later stages.");
}



function closeAddBookModal(){
    selectedBook = null;
    selectedBookIndex = null;
    searchResults.innerHTML = "";
    selectedBookPreview.innerHTML = "";
    bookSearchInput.value = "";
    addBookModal.classList.add("modal-hidden");
}


/* ==========================================
    Admin Authorization
=============================================*/


function authenticateAdmin(){
    // Already logged in?
    if(isAdmin){
        const logout =
            confirm("Exit Admin Mode?");
        if(logout){
            isAdmin = false;
            localStorage.removeItem("isAdmin");
            settingsButton.style.display = "none";
            adminButton.textContent = "🔒";
            refreshLibrary();
        }
        return;
    }
    // Login
    const password =
        prompt("Passcode please?");
    if(password === "Admin123"){
        isAdmin = true;
        localStorage.setItem(
            "isAdmin",
            "true"
        );
        settingsButton.style.display = "block";
        adminButton.textContent = "👑";
        refreshLibrary();
        alert("Yo, Admin. Welcome!");
    }
    else{
        alert("Uh..Uh.. it isn't the one my dear.");
    }
}


/* ==========================================
   Application Initilization
========================================== */


initializeApplication();

async function initializeApplication() {
    console.log("Initializing application...");
    try {
        const databaseBooks =
            await fetchBooks();
        console.log(databaseBooks);
        books.length = 0;
        books.push(...databaseBooks);
        renderLibrary( library, books, shelves, isAdmin);
        console.log("Rendering library...");
        console.log(
            "Loaded",
            books.length,
            "books from backend."
        );
    }
    catch (error) {
        console.error(error);
        alert(
            "Hmmm.... Can't reach the backend now."
        );
    }
}