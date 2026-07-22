const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAllMembers = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("members")
            .find();

        const lists = await results.toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSingleMember = async (req, res) => {
    try {
        const memberId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .collection("members")
            .findOne({ _id: memberId });

        if (!result) {
            return res.status(404).json({
                message: "Member not found."
            });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMember = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            membershipDate,
            gender,
            age
        } = req.body;

        // Validation
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !membershipDate ||
            !gender ||
            age === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const member = {
            firstName,
            lastName,
            email,
            phone,
            membershipDate,
            gender,
            age
        };

        const response = await mongodb
            .getDatabase()
            .collection("members")
            .insertOne(member);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Member created successfully",
                id: response.insertedId
            });
        } else {
            res.status(500).json({
                message: "Failed to create member."
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            membershipDate,
            gender,
            age
        } = req.body;

        // Validation
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !membershipDate ||
            !gender ||
            age === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const memberId = new ObjectId(req.params.id);

        const member = {
            firstName,
            lastName,
            email,
            phone,
            membershipDate,
            gender,
            age
        };

        const response = await mongodb
            .getDatabase()
            .collection("members")
            .replaceOne({ _id: memberId }, member);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount === 0) {
            res.status(404).json({
                message: "Member not found."
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

const deleteMember = async (req, res) => {
    try {
        const memberId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .collection("members")
            .deleteOne({ _id: memberId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({
                message: "Member not found."
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMembers,
    getSingleMember,
    createMember,
    updateMember,
    deleteMember
};