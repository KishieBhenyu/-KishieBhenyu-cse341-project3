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

app.use(express.json());

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

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

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
// Passport Session
// ======================

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// ======================
// Routes
// ======================

app.use("/", require("./routes"));

// ======================
// Start Database and Server
// ======================

const request = require("supertest");
const { app, startServer } = require("../server");

beforeAll(async () => {
    await startServer();
});

describe("Hosts API", () => {

    test("GET /hosts should return all hosts", async () => {
        const response = await request(app)
            .get("/hosts");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /hosts/:id should return one host", async () => {
        const response = await request(app)
            .get("/hosts/6a7b243cf33bb42b01f86a71");

        expect(response.statusCode).toBe(200);
    });

});

// Start automatically when running:
// npm start
if (require.main === module) {
    startServer();
}

// Export for Jest/Supertest
module.exports = {
    app,
    startServer
};