const request = require("supertest");
const app = require("../server");

describe("Attendees API", () => {

    test("GET /attendees should return all attendees", async () => {
        const response = await request(app)
            .get("/attendees");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /attendees/:id should return one attendee", async () => {
        const response = await request(app)
            .get("/attendees/6a7b2047f33bb42b01f86a6a");

        expect([200, 404]).toContain(response.statusCode);
    });

});