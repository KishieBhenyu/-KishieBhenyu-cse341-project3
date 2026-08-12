const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");

beforeAll((done) => {
    mongodb.initDb((err) => {
        done(err);
    });
});

describe("Attendees API", () => {
    test("GET /attendees should return all attendees", async () => {
        const response = await request(app).get("/attendees");

        console.log("GET /attendees status:", response.statusCode);
        console.log("GET /attendees body:", response.body);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /attendees/:id should return one attendee", async () => {
        const response = await request(app)
            .get("/attendees/6a7b2047f33bb42b01f86a6a");

        console.log("GET /attendees/:id status:", response.statusCode);
        console.log("GET /attendees/:id body:", response.body);

        expect([200, 404]).toContain(response.statusCode);
    });
});