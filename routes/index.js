const express = require("express");
const passport = require("passport");

const router = express.Router();

router.use("/", require("./swagger"));

// Home
router.get("/", (req, res) => {
  if (req.user) {
    res.send(`Logged in as ${req.user.username}`);
  } else {
    res.send("Logged Out");
  }
});

// Login with GitHub
router.get(
  "/login",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

// GitHub Callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// API Routes
router.use("/books", require("./books"));
router.use("/members", require("./members"));

module.exports = router;