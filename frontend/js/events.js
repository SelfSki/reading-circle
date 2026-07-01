import {
    openSettingsModal,
    closeSettingsModal,
    openAddBookModal,
    openEditBookModal,
    closeAddBookModal,
    saveSettings
} from "./modals.js";

import {
    searchBooks,
    fetchBookDetails,
    normalizeBook,
    renderSearchResults,
    renderSelectedBook
} from "./search.js";


import {
    renderLibrary
} from "./library.js";


export function initializeEventListeners({

    library,

    settingsButton,
    cancelButton,
    saveButton,

    cancelBookButton,
    saveBookButton,

    searchBookButton,

    searchResults,
    bookSearchInput,    
   
    modalOverlay,
    addBookModal,

    books,
    shelves,

    getSelectedShelf,
    setSelectedShelf,

    getSelectedBook,
    setSelectedBook,

    getEditingBookIndex,
    setEditingBookIndex,

    saveBook,
    deleteBook,
    editProgress,
    editRating,

    saveSettings,
    handleKeyPress,
    selectBook,
    
    setSearchBooksResult,

    refreshLibrary

}) {


}