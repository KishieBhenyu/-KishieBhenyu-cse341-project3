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

// ===========================
// Middleware
// ===========================

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
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

// ===========================
// Passport GitHub Strategy
// ===========================

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, profile);
    }
  )
);

// Save user in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Read user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ===========================
// Authentication Routes
// ===========================

// Login
app.get(
  "/login",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

// GitHub Callback
app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// ===========================
// Home Route
// ===========================

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Logged in as ${req.user.displayName}`);
  } else {
    res.send("Logged Out");
  }
});

// ===========================
// API Routes
// ===========================

app.use("/", require("./routes"));

// ===========================
// Start Server
// ===========================

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Database connected`);
      console.log(`Server running on port ${port}`);
    });
  }
});