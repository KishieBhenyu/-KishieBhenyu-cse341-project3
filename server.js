const express = require("express");
const bodyParser = require("body-parser");

const mongodb = require("./data/database");
const app = express();

const port = process.env.PORT || 3001;

// Parse request bodies FIRST
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/", require("./routes"));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node is running on port ${port}`);
        });
    }
});