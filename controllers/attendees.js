
const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// GET all attendees
const getAll = async (req, res) => {
    try {
        const results = await mongodb
            .getDatabase()
            .collection("attendees")
            .find()
            .toArray();

        res.status(200).json(results);
    } catch (error) {
        console.error("Error getting attendees:", error);

        res.status(500).json({
            message: "An error occurred while retrieving attendees.",
            error: error.message
        });
    }
};

// GET single attendee
const getSingle = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid attendee ID."
            });
        }

        const attendeeId = new ObjectId(id);

        const result = await mongodb
            .getDatabase()
            .collection("attendees")
            .findOne({
                _id: attendeeId
            });

        if (!result) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error getting attendee:", error);

        res.status(500).json({
            message: "An error occurred while retrieving the attendee.",
            error: error.message
        });
    }
};

// POST create attendee
const createAttendee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            eventId,
            registrationDate,
            ticketType,
            status
        } = req.body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !eventId ||
            !registrationDate ||
            !ticketType ||
            !status
        ) {
            return res.status(400).json({
                message: "All attendee fields are required."
            });
        }

        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        // Validate status
        const validStatuses = [
            "Registered",
            "Cancelled",
            "Attended"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be Registered, Cancelled, or Attended."
            });
        }

        // Validate ticket type
        const validTicketTypes = [
            "Standard",
            "VIP"
        ];

        if (!validTicketTypes.includes(ticketType)) {
            return res.status(400).json({
                message: "Ticket type must be Standard or VIP."
            });
        }

        const attendee = {
            firstName,
            lastName,
            email,
            phone,
            eventId,
            registrationDate,
            ticketType,
            status
        };

        const response = await mongodb
            .getDatabase()
            .collection("attendees")
            .insertOne(attendee);

        if (!response.acknowledged) {
            return res.status(500).json({
                message: "Failed to create attendee."
            });
        }

        res.status(201).json({
            message: "Attendee created successfully.",
            id: response.insertedId
        });
    } catch (error) {
        console.error("Error creating attendee:", error);

        res.status(500).json({
            message: "An error occurred while creating the attendee.",
            error: error.message
        });
    }
};

// PUT update attendee
const updateAttendee = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid attendee ID."
            });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            eventId,
            registrationDate,
            ticketType,
            status
        } = req.body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !eventId ||
            !registrationDate ||
            !ticketType ||
            !status
        ) {
            return res.status(400).json({
                message: "All attendee fields are required."
            });
        }

        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        // Validate status
        const validStatuses = [
            "Registered",
            "Cancelled",
            "Attended"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status must be Registered, Cancelled, or Attended."
            });
        }

        // Validate ticket type
        const validTicketTypes = [
            "Standard",
            "VIP"
        ];

        if (!validTicketTypes.includes(ticketType)) {
            return res.status(400).json({
                message: "Ticket type must be Standard or VIP."
            });
        }

        const attendeeId = new ObjectId(id);

        const attendee = {
            firstName,
            lastName,
            email,
            phone,
            eventId,
            registrationDate,
            ticketType,
            status
        };

        const response = await mongodb
            .getDatabase()
            .collection("attendees")
            .replaceOne(
                { _id: attendeeId },
                attendee
            );

        if (response.matchedCount === 0) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        if (response.modifiedCount === 0) {
            return res.status(200).json({
                message: "No changes were made."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error updating attendee:", error);

        res.status(500).json({
            message: "An error occurred while updating the attendee.",
            error: error.message
        });
    }
};

// DELETE attendee
const deleteAttendee = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid attendee ID."
            });
        }

        const attendeeId = new ObjectId(id);

        const response = await mongodb
            .getDatabase()
            .collection("attendees")
            .deleteOne({
                _id: attendeeId
            });

        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting attendee:", error);

        res.status(500).json({
            message: "An error occurred while deleting the attendee.",
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createAttendee,
    updateAttendee,
    deleteAttendee
};

