
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all venues
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("venues")
            .find()
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error("Error getting venues:", error);

        res.status(500).json({
            message: "An error occurred while retrieving venues.",
            error: error.message
        });
    }
};

// GET single venue
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const venueId = new ObjectId(id);

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

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting venue:", error);

        res.status(500).json({
            message: "An error occurred while retrieving the venue.",
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

        // Validate required fields
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
                message: "All venue fields are required."
            });
        }

        // Validate capacity
        if (typeof capacity !== "number" || capacity < 0) {
            return res.status(400).json({
                message: "Capacity must be a positive number or zero."
            });
        }

        // Validate email
        if (!contactEmail.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid contact email."
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

        if (!response.acknowledged) {
            return res.status(500).json({
                message: "Failed to create venue."
            });
        }

        res.status(201).json({
            message: "Venue created successfully.",
            id: response.insertedId
        });
    } catch (error) {
        console.error("Error creating venue:", error);

        res.status(500).json({
            message: "An error occurred while creating the venue.",
            error: error.message
        });
    }
};

// PUT update venue
const updateVenue = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const {
            name,
            address,
            city,
            country,
            capacity,
            contactEmail,
            contactPhone
        } = req.body;

        // Validate required fields
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
                message: "All venue fields are required."
            });
        }

        // Validate capacity
        if (typeof capacity !== "number" || capacity < 0) {
            return res.status(400).json({
                message: "Capacity must be a positive number or zero."
            });
        }

        // Validate email
        if (!contactEmail.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid contact email."
            });
        }

        const venueId = new ObjectId(id);

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

        if (response.matchedCount === 0) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        if (response.modifiedCount === 0) {
            return res.status(200).json({
                message: "No changes were made."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error updating venue:", error);

        res.status(500).json({
            message: "An error occurred while updating the venue.",
            error: error.message
        });
    }
};

// DELETE venue
const deleteVenue = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue ID."
            });
        }

        const venueId = new ObjectId(id);

        const response = await mongodb
            .getDatabase()
            .collection("venues")
            .deleteOne({
                _id: venueId
            });

        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting venue:", error);

        res.status(500).json({
            message: "An error occurred while deleting the venue.",
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

