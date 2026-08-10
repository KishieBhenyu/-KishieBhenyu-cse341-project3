
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all venues
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("venues")
            .find();

        const lists = await results.toArray();

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// GET single venue
const getSingle = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const venueId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .collection("venues")
            .findOne({
                _id: venueId
            });

        if (!result) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// POST create venue
const createVenue = async (req, res) => {
    try {
        const {
            name,
            address,
            city,
            country,
            capacity,
            contactEmail,
            contactPhone
        } = req.body;

        // Validation
        if (
            !name ||
            !address ||
            !city ||
            !country ||
            capacity === undefined ||
            !contactEmail ||
            !contactPhone
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const venue = {
            name,
            address,
            city,
            country,
            capacity,
            contactEmail,
            contactPhone
        };

        const response = await mongodb
            .getDatabase()
            .collection("venues")
            .insertOne(venue);

        if (response.acknowledged) {
            res.status(201).json({
                message: "Venue created successfully",
                id: response.insertedId
            });
        } else {
            res.status(500).json({
                message: "Failed to create venue."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// PUT update venue
const updateVenue = async (req, res) => {
    try {
        const {
            name,
            address,
            city,
            country,
            capacity,
            contactEmail,
            contactPhone
        } = req.body;

        // Validation
        if (
            !name ||
            !address ||
            !city ||
            !country ||
            capacity === undefined ||
            !contactEmail ||
            !contactPhone
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const venueId = new ObjectId(req.params.id);

        const venue = {
            name,
            address,
            city,
            country,
            capacity,
            contactEmail,
            contactPhone
        };

        const response = await mongodb
            .getDatabase()
            .collection("venues")
            .replaceOne(
                {
                    _id: venueId
                },
                venue
            );

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount === 0) {
            res.status(404).json({
                message: "Venue not found."
            });
        } else {
            res.status(200).json({
                message: "No changes were made."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// DELETE venue
const deleteVenue = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const venueId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .collection("venues")
            .deleteOne({
                _id: venueId
            });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({
                message: "Venue not found."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createVenue,
    updateVenue,
    deleteVenue
};

