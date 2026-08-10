
const express = require("express");
const router = express.Router();

const venuesController = require("../controllers/venues");
const { isAuthenticated } = require("../middleware/authenticate");

// Public routes
router.get("/", venuesController.getAll);
router.get("/:id", venuesController.getSingle);

// Protected routes
router.post("/", isAuthenticated, venuesController.createVenue);
router.put("/:id", isAuthenticated, venuesController.updateVenue);
router.delete("/:id", isAuthenticated, venuesController.deleteVenue);

module.exports = router;

