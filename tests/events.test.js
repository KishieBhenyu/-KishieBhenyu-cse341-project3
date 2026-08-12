const request = require("supertest");
const { app, startServer } = require("../server");

beforeAll(async () => {
    await startServer();
});

describe("Events API", () => {

    test("GET /events should return all events", async () => {
        const response = await request(app)
            .get("/events");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /events/:id should return one event", async () => {
        const response = await request(app)
            .get("/events/6a7981cffb77f5b929943463");

        expect(response.statusCode).toBe(200);
    });

});