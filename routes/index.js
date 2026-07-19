const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/books", require("./books"));
router.use("/members", require("./members"));

module.exports = router;