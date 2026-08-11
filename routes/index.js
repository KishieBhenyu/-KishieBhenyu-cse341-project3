
const express = require("express");
const passport = require("passport");

const router = express.Router();

// Swagger
router.use("/", require("./swagger"));

// HOME
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        const githubName =
            req.user.username ||
            req.user._json?.login ||
            req.user.displayName ||
            "GitHub User";

        res.send(`Logged in as ${githubName}`);
    } else {
        res.send("Logged Out");
    }
});

// LOGIN
router.get(
    "/login",
    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

// GITHUB CALLBACK
router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/"
    }),
    (req, res) => {
        res.redirect("/");
    }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

// API ROUTES
router.use("/events", require("./events"));
router.use("/venues", require("./venues"));
router.use("/hosts", require("./hosts"));
router.use("/attendees", require("./attendees"));

module.exports = router;

