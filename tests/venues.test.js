const request = require("supertest");
const { app, startServer } = require("../server");

beforeAll(async () => {
    await startServer();
});

describe("Venues API", () => {

    test("GET /venues should return all venues", async () => {
        const response = await request(app)
            .get("/venues");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /venues/:id should return one venue", async () => {
        const response = await request(app)
            .get("/venues/6a798430fb77f5b92994346c");

        expect(response.statusCode).toBe(200);
    });

});