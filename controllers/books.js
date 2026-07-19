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

module.exports = {
    getAll,
    getSingle
};