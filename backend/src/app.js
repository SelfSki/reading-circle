const cors = require("cors");
const express = require("express");

const booksRoute =
    require("./routes/books");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {

    res.json({

        application: "Reading Circle",

        version: "1.0"

    });

});

app.use("/books", booksRoute);

module.exports = app;