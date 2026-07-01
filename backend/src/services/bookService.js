
const pool =
    require("../database/db");

const bookRepository =
    require("../repositories/bookRepository");

async function getLibraryBooks() {
    return await bookRepository.getAllBooks();
}


async function addBook(book) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        let author = await bookRepository.findAuthorByName(client, book.author);
        let authorId;
            if (!author) {
                author = await bookRepository.createAuthor(client, book.author);
            }
            authorId = author.id;
            let existingBook =
                await bookRepository.findBookByTitle(client, book.title);
            let bookId;

            if (!existingBook) {
                existingBook = await bookRepository.createBook(client, book);
            }
            bookId = existingBook.id;
            await bookRepository.createBookAuthor(client, bookId, authorId);
            
            const adminId = await bookRepository.getAdminId(client);
            const statusMap = {
                "repository": "WANT_TO_READ",
                "currently-reading": "READING",
                "finished": "FINISHED"
                };
            await bookRepository.addBookToLibrary(client, adminId, bookId, statusMap[book.status]);
            await client.query("COMMIT");
            return {
                id: bookId,
                ...book
            };

        }
        catch(error){
            await client.query("ROLLBACK");
            throw error;
            }
            
            finally {
                client.release();
            }
    }


    async function deleteBook(libraryEntryId) {
    const client =
        await pool.connect();
    try {
        await client.query("BEGIN");     
        const adminId =
            await bookRepository.getAdminId(client);
            await bookRepository.removeBookFromLibrary(client, libraryEntryId);
        await client.query("COMMIT");
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}



async function updateBook(libraryEntry) 
{
    const client =
        await pool.connect();
    try {
        await client.query("BEGIN");
        const statusMap = {
            "repository": "WANT_TO_READ",
            "currently-reading": "READING",
            "finished": "FINISHED"
        };

        libraryEntry.status =
            statusMap[libraryEntry.status];
        await bookRepository.updateLibraryEntry(
            client,
            libraryEntry
        );
        await client.query("COMMIT");
    }
    catch(error){
        await client.query("ROLLBACK");
        throw error;
    }
    finally{
        client.release();
    }
}

module.exports = {getLibraryBooks, addBook, deleteBook, updateBook};