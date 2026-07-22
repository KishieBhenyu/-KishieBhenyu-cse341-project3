const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("books")
            .find();

        const lists = await results.toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .collection("books")
            .findOne({ _id: bookId });

        if (!result) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            genre,
            publishedYear,
            publisher,
            availableCopies,
            language
        } = req.body;

        // Validation
        if (
            !title ||
            !author ||
            !genre ||
            !publishedYear ||
            !publisher ||
            availableCopies === undefined ||
            !language
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const book = {
            title,
            author,
            genre,
            publishedYear,
            publisher,
            availableCopies,
            language
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
            res.status(500).json({
                message: "Failed to create book."
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const {
            title,
            author,
            genre,
            publishedYear,
            publisher,
            availableCopies,
            language
        } = req.body;

        // Validation
        if (
            !title ||
            !author ||
            !genre ||
            !publishedYear ||
            !publisher ||
            availableCopies === undefined ||
            !language
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const bookId = new ObjectId(req.params.id);

        const book = {
            title,
            author,
            genre,
            publishedYear,
            publisher,
            availableCopies,
            language
        };

        const response = await mongodb
            .getDatabase()
            .collection("books")
            .replaceOne({ _id: bookId }, book);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount === 0) {
            res.status(404).json({
                message: "Book not found."
            });
        } else {
            res.status(200).json({
                message: "No changes were made."
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .collection("books")
            .deleteOne({ _id: bookId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({
                message: "Book not found."
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};