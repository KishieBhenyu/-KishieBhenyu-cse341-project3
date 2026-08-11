
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all hosts
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("hosts")
            .find()
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error("Error getting hosts:", error);

        res.status(500).json({
            message: "An error occurred while retrieving hosts.",
            error: error.message
        });
    }
};

// GET single host
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid host ID."
            });
        }

        const hostId = new ObjectId(id);

        const result = await mongodb
            .getDatabase()
            .collection("hosts")
            .findOne({
                _id: hostId
            });

        if (!result) {
            return res.status(404).json({
                message: "Host not found."
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting host:", error);

        res.status(500).json({
            message: "An error occurred while retrieving the host.",
            error: error.message
        });
    }
};

// POST create host
const createHost = async (req, res) => {
    try {
        const {
            name,
            organization,
            email,
            phone,
            address,
            city,
            country
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !organization ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !country
        ) {
            return res.status(400).json({
                message: "All host fields are required."
            });
        }

        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        const host = {
            name,
            organization,
            email,
            phone,
            address,
            city,
            country
        };

        const response = await mongodb
            .getDatabase()
            .collection("hosts")
            .insertOne(host);

        if (!response.acknowledged) {
            return res.status(500).json({
                message: "Failed to create host."
            });
        }

        res.status(201).json({
            message: "Host created successfully.",
            id: response.insertedId
        });
    } catch (error) {
        console.error("Error creating host:", error);

        res.status(500).json({
            message: "An error occurred while creating the host.",
            error: error.message
        });
    }
};

// PUT update host
const updateHost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid host ID."
            });
        }

        const {
            name,
            organization,
            email,
            phone,
            address,
            city,
            country
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !organization ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !country
        ) {
            return res.status(400).json({
                message: "All host fields are required."
            });
        }

        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        const hostId = new ObjectId(id);

        const host = {
            name,
            organization,
            email,
            phone,
            address,
            city,
            country
        };

        const response = await mongodb
            .getDatabase()
            .collection("hosts")
            .replaceOne(
                {
                    _id: hostId
                },
                host
            );

        if (response.matchedCount === 0) {
            return res.status(404).json({
                message: "Host not found."
            });
        }

        if (response.modifiedCount === 0) {
            return res.status(200).json({
                message: "No changes were made."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error updating host:", error);

        res.status(500).json({
            message: "An error occurred while updating the host.",
            error: error.message
        });
    }
};

// DELETE host
const deleteHost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid host ID."
            });
        }

        const hostId = new ObjectId(id);

        const response = await mongodb
            .getDatabase()
            .collection("hosts")
            .deleteOne({
                _id: hostId
            });

        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: "Host not found."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting host:", error);

        res.status(500).json({
            message: "An error occurred while deleting the host.",
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createHost,
    updateHost,
    deleteHost
};

