
const express = require("express");
const router = express.Router();

const hostsController = require("../controllers/hosts");
const { isAuthenticated } = require("../middleware/authenticate");

// Public routes
router.get("/", hostsController.getAll);
router.get("/:id", hostsController.getSingle);

// Protected routes
router.post("/", isAuthenticated, hostsController.createHost);
router.put("/:id", isAuthenticated, hostsController.updateHost);
router.delete("/:id", isAuthenticated, hostsController.deleteHost);

module.exports = router;

