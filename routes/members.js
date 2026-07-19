const express = require("express");
const router = express.Router();

const membersController = require("../controllers/members");

router.get("/", membersController.getAll);

router.get("/:id", membersController.getSingle);

module.exports = router;