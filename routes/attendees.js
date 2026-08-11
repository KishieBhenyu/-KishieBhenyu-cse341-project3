
const express = require("express");
const router = express.Router();

const attendeesController = require("../controllers/attendees");
const { isAuthenticated } = require("../middleware/authenticate");

// Public routes
router.get("/", attendeesController.getAll);
router.get("/:id", attendeesController.getSingle);

// Protected routes
router.post("/", isAuthenticated, attendeesController.createAttendee);
router.put("/:id", isAuthenticated, attendeesController.updateAttendee);
router.delete("/:id", isAuthenticated, attendeesController.deleteAttendee);

module.exports = router;

