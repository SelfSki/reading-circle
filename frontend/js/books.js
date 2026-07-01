
/*
==================================================
Books Data
==================================================

Purpose:
    Stores all book information.

Future:
    This data will eventually come from Supabase
    instead of being hardcoded.

Owner:
    app.js reads this file.
*/

const books = [

    {
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        status: "currently-reading",
        progress: 35,
        rating: null,
        cover: "https://covers.openlibrary.org/b/isbn/9780261103344-L.jpg"
    },

    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        status: "finished",
        progress: 100,
        rating: 5,
        cover: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg"
    },

    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        status: "repository",
        progress: 0,
        rating: null,
        cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"
    }

];