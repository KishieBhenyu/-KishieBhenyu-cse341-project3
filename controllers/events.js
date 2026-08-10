
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all events
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("events")
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

// GET single event
const getSingle = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const eventId = new ObjectId(req.params.id);

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

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
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

        // Validation
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
                message: "All fields are required."
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

        if (response.acknowledged) {
            res.status(201).json({
                message: "Event created successfully",
                id: response.insertedId
            });
        } else {
            res.status(500).json({
                message: "Failed to create event."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// PUT update event
const updateEvent = async (req, res) => {
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

        // Validation
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
                message: "All fields are required."
            });
        }

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const eventId = new ObjectId(req.params.id);

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

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else if (response.matchedCount === 0) {
            res.status(404).json({
                message: "Event not found."
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

// DELETE event
const deleteEvent = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid event ID."
            });
        }

        const eventId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .collection("events")
            .deleteOne({
                _id: eventId
            });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({
                message: "Event not found."
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
    createEvent,
    updateEvent,
    deleteEvent
};

