const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
require("dotenv").config();

const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 3001;

// ======================
// Middleware
// ======================

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ======================
// Passport GitHub Strategy
// ======================

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Store user in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Retrieve user from session
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
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log("Database connected");
      console.log(`Server running on port ${port}`);
    });
  }
});