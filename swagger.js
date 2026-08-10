
const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Event Management API",
        description: "API for managing events and venues",
        version: "1.0.0"
    },

    host: "localhost:3002",

    schemes: ["http"],

    tags: [
        {
            name: "Events",
            description: "Event management endpoints"
        },
        {
            name: "Venues",
            description: "Venue management endpoints"
        },
        {
            name: "Authentication",
            description: "GitHub authentication endpoints"
        }
    ]
};

const outputFile = "./swagger.json";

const endpointsFiles = [
    "./routes/index.js",
    "./routes/events.js",
    "./routes/venues.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);

