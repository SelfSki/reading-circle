

const pool =
    require("../database/db");



async function getAllBooks() {
    const result =
        await pool.query(`
            SELECT *
            FROM reading_circle.admin_library
            ORDER BY title;
        `);
    return result.rows;
}




async function getAdminId(client) {
    const result =
        await client.query(`
            SELECT id
            FROM reading_circle.users
            WHERE username='admin'
        `);
    return result.rows[0].id;
}



async function addBookToLibrary(client, userId, bookId, status) {
    await client.query(
        `
        INSERT INTO
        reading_circle.user_library
        (
            user_id,
            book_id,
            status
        )
        VALUES
        ($1, $2, $3)`,
        [
            userId, bookId, status
        ]
    );
}



async function findAuthorByName(client, name) {
    const result =
        await client.query(
            `
            SELECT id
            FROM reading_circle.authors
            WHERE LOWER(name)=LOWER($1)
            `,
            [name]
        );
    return result.rows[0];
}


async function createAuthor(client, name) {
    const result =
        await client.query(
            `
            INSERT INTO
            reading_circle.authors
            (
                name
            )
            VALUES
            (
                $1
            )
            RETURNING id
            `,
            [name]
        );
    return result.rows[0];
}


async function findBookByTitle(client,title) {
    const result =
        await client.query(
            `
            SELECT id
            FROM reading_circle.book_catalog
            WHERE LOWER(title)=LOWER($1)
            `,
            [title]
        );
    return result.rows[0];
}



async function createBook(client,book) {
    const result =
        await client.query(
            `
            INSERT INTO
            reading_circle.book_catalog
            (
                title,
                description,
                cover_url
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            RETURNING id
            `,
            [
                book.title,
                book.description,
                book.cover
            ]
        );
    return result.rows[0];
}



async function createBookAuthor(client, bookId,authorId) {

    await client.query(
        `
        INSERT INTO
        reading_circle.book_authors
        (
            book_id,
            author_id
        )
        VALUES
        (
            $1,
            $2
        )
        ON CONFLICT DO NOTHING
        `,
        [
            bookId,
            authorId
        ]
    );
}



async function removeBookFromLibrary(client, libraryEntryId) 
    {
        await client.query(
            `
            DELETE
            FROM reading_circle.user_library
            WHERE
                id = $1
            `,
            [
                libraryEntryId
            ]
        );
    }


async function updateLibraryEntry(client, libraryEntry) {
    await client.query(
        `
        UPDATE reading_circle.user_library
        SET
            status = $2,
            progress = $3,
            rating = $4
        WHERE
            id = $1
        `,
        [
            libraryEntry.id, libraryEntry.status, libraryEntry.progress, libraryEntry.rating
        ]
    );
}


    module.exports = {
    getAllBooks, getAdminId, addBookToLibrary, findAuthorByName, createAuthor, findBookByTitle, createBook, createBookAuthor, 
    removeBookFromLibrary, updateLibraryEntry
};