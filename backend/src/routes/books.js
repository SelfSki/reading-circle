const express = require("express");

const router = express.Router();

const bookService = require("../services/bookService");

router.get("/", async (req, res) => {
    try {
        const books =
            await bookService.getLibraryBooks();
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to fetch books"
        });
    }
});



router.post("/", async (req, res) => {
    try {
        const book =
            await bookService.addBook(req.body);
            res.status(201).json(book);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to create book"
        });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        await bookService.deleteBook(
            req.params.id
        );
        res.sendStatus(204);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to delete book"
        });
    }
});


router.patch(
    "/:id",
    async (req,res)=>{
        try{
            await bookService.updateBook({
                id:req.params.id,
                status:req.body.status,
                progress:req.body.progress,
                rating:req.body.rating
            });
            res.sendStatus(204);
        }
        catch(error){
            console.error(error);
            res.status(500).json({
                error:"Unable to update book"
            });
        }
    }
);


module.exports = router;
