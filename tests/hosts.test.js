const request = require("supertest");
const { app, startServer } = require("../server");

beforeAll((done) => {
    startServer();
    setTimeout(done, 1000);
});

describe("Hosts API", () => {

    test("GET /hosts should return all hosts", async () => {
        const response = await request(app)
            .get("/hosts");

        console.log("GET /hosts status:", response.statusCode);
        console.log("GET /hosts body:", response.body);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /hosts/:id should return one host", async () => {
        const response = await request(app)
            .get("/hosts/6a7b243cf33bb42b01f86a71");

        console.log("GET /hosts/:id status:", response.statusCode);
        console.log("GET /hosts/:id body:", response.body);

        expect(response.statusCode).toBe(200);
    });

});