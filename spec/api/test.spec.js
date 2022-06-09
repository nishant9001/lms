const supertest = require("supertest");

const app = require("../../app");

describe("it", () => {
  const request = supertest(app);
  xit("should link the swagger file", async () => {
    const response = await request.get("/api-docs/");

    expect(response.status).toBe(200);
  });
});
