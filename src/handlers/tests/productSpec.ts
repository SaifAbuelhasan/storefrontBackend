import app from "../../server";
import supertest from "supertest";
// test products handler

const request = supertest(app);
describe("Test products handler", () => {
  // test index handler
  it("gets the api/products endpoint", async () => {
    const res = await request.get("/api/products");
    expect(res.status).toBe(200);
  });

  //   // test show handler
  //   it("gets the api/products/:id endpoint", async () => {
  //     const res = await request.get("/api/products/1");
  //     expect(res.status).toBe(200);
  //   });
});
