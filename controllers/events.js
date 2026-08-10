
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all events
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("events")
            .find()
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error("Error getting events:", error);

        res.status(500).json({
            message: "An error occurred while retrieving events.",
            error: error.message
        });
    }
};

// GET single event
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const eventId = new ObjectId(id);

        const result = await mongodb
            .getDatabase()
            .collection("events")
            .findOne({
                _id: eventId
            });

        if (!result) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting event:", error);

        res.status(500).json({
            message: "An error occurred while retrieving the event.",
            error: error.message
        });
    }
};

// POST create event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            ticketPrice
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !description ||
            !date ||
            !startTime ||
            !endTime ||
            !organizer ||
            ticketPrice === undefined
        ) {
            return res.status(400).json({
                message: "All event fields are required."
            });
        }

        // Validate ticket price
        if (typeof ticketPrice !== "number" || ticketPrice < 0) {
            return res.status(400).json({
                message: "Ticket price must be a positive number or zero."
            });
        }

        const event = {
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            ticketPrice
        };

        const response = await mongodb
            .getDatabase()
            .collection("events")
            .insertOne(event);

        if (!response.acknowledged) {
            return res.status(500).json({
                message: "Failed to create event."
            });
        }

        res.status(201).json({
            message: "Event created successfully.",
            id: response.insertedId
        });
    } catch (error) {
        console.error("Error creating event:", error);

        res.status(500).json({
            message: "An error occurred while creating the event.",
            error: error.message
        });
    }
};

// PUT update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const {
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            ticketPrice
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !description ||
            !date ||
            !startTime ||
            !endTime ||
            !organizer ||
            ticketPrice === undefined
        ) {
            return res.status(400).json({
                message: "All event fields are required."
            });
        }

        // Validate ticket price
        if (typeof ticketPrice !== "number" || ticketPrice < 0) {
            return res.status(400).json({
                message: "Ticket price must be a positive number or zero."
            });
        }

        const eventId = new ObjectId(id);

        const event = {
            title,
            description,
            date,
            startTime,
            endTime,
            organizer,
            ticketPrice
        };

        const response = await mongodb
            .getDatabase()
            .collection("events")
            .replaceOne(
                { _id: eventId },
                event
            );

        if (response.matchedCount === 0) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        if (response.modifiedCount === 0) {
            return res.status(200).json({
                message: "No changes were made."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error updating event:", error);

        res.status(500).json({
            message: "An error occurred while updating the event.",
            error: error.message
        });
    }
};

// DELETE event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const eventId = new ObjectId(id);

        const response = await mongodb
            .getDatabase()
            .collection("events")
            .deleteOne({
                _id: eventId
            });

        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting event:", error);

        res.status(500).json({
            message: "An error occurred while deleting the event.",
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createEvent,
    updateEvent,
    deleteEvent
};

