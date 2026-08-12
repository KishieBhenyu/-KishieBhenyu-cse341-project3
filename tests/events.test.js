const request = require("supertest");
const app = require("../server");
const mongodb = require("../data/database");

beforeAll((done) => {
    mongodb.initDb((err) => {
        done(err);
    });
});

describe("Events API", () => {
    test("GET /events should return all events", async () => {
        const response = await request(app).get("/events");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /events/:id should return one event", async () => {
        const response = await request(app)
            .get("/events/6a7981cffb77f5b929943463");

        expect([200, 404]).toContain(response.statusCode);
    });
});