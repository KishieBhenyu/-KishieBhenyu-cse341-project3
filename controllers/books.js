const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    const results = await mongodb
        .getDatabase()
        .collection("books")
        .find();

    const lists = await results.toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
};

const getSingle = async (req, res) => {
    const bookId = req.params.id;

    const result = await mongodb
        .getDatabase()
        .collection("books")
        .findOne({ _id: new ObjectId(bookId) });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
};

const createBook = async (req, res) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishedYear: req.body.publishedYear,
    publisher: req.body.publisher,
    availableCopies: req.body.availableCopies,
    language: req.body.language,
  };

     const response = await mongodb
        .getDatabase()
        .collection("books")
        .insertOne(book);

    if (response.acknowledged) {
        res.status(201).json({
            message: "Book created successfully",
            id: response.insertedId
        });
    } else {
        res.status(500).json(response.error || "Failed to create book.");
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);

        const book = {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            publishedYear: req.body.publishedYear,
            publisher: req.body.publisher,
            availableCopies: req.body.availableCopies,
            language: req.body.language,
        };

        const response = await mongodb
            .getDatabase()
            .collection("books")
            .replaceOne({ _id: bookId }, book);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json("Book not found or no changes made.");
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBook = async (req, res) => {
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().collection("books").deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || "Failed to delete book.");
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};