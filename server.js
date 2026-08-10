
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
require("dotenv").config();

const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 3002;

// ======================
// Middleware
// ======================

// Parse JSON request bodies
app.use(express.json());

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "development-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false
        }
    })
);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

// ======================
// Passport GitHub Strategy
// ======================

// ======================
// Passport GitHub Strategy
// ======================

if (
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    process.env.CALLBACK_URL
) {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL
            },
            (accessToken, refreshToken, profile, done) => {
                return done(null, profile);
            }
        )
    );

    console.log("GitHub authentication configured.");
} else {
    console.log("GitHub authentication not configured yet.");
}

// ======================
// Store user in session
// ======================

passport.serializeUser((user, done) => {
    done(null, user);
});

// ======================
// Retrieve user from session
// ======================

passport.deserializeUser((user, done) => {
    done(null, user);
});

// ======================
// Routes
// ======================

app.use("/", require("./routes"));

// ======================
// Start Server
// ======================

mongodb.initDb((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }

    app.listen(port, () => {
        console.log("Database connected");
        console.log(`Server running on port ${port}`);
    });
});

