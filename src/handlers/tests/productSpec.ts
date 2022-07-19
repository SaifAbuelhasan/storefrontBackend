import app from "../../server";
import supertest from "supertest";
import { Product } from "../../models/products";
// test products handler

const request = supertest(app);
let token: string;
let product: Product;
describe("Test products handler", () => {
  // before all create new user
  beforeAll(async () => {
    // signup user
    const res = await request.post("/api/users/signup").send({
      firstName: "Product",
      lastName: "Test",
      password: "password123",
    });
    // get the token
    token = res.body.token;
    // create product
    product = (
      await request
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Product",
          price: 10,
          category: "Test",
        })
    ).body;
  });

  // test create handler
  it("creates a product", async () => {
    const res = await request
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        price: 10.99,
        category: "Test",
      });
    expect(res.status).toBe(201);
  });

  // test create handler without token
  it("creates a product without token", async () => {
    const res = await request.post("/api/products").send({
      name: "Test Product",
      price: 10.99,
      category: "Test",
    });
    expect(res.status).toBe(401);
  });

  // test index handler
  it("gets the api/products endpoint", async () => {
    const res = await request.get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toContain(product);
  });

  // test show handler
  it("gets the api/products/:id endpoint", async () => {
    // get request with token as authorization header
    const res = await request.get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
  });
});
