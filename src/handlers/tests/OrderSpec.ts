// testing order handler
import app from "../../server";
import supertest from "supertest";
import { Order } from "../../models/orders";

const request = supertest(app);
let token: string;
let id: number;
let order: Order;
describe("Test orders handler", () => {
  // before all create new user, order, and product
  beforeAll(async () => {
    // signup user
    const res = await request.post("/api/users/signup").send({
      firstName: "Order",
      lastName: "Test",
      password: "password123",
    });
    // get the token
    token = res.body.token;
    // get the id
    id = res.body.id;
    // create order
    order = (
      await request
        .post("/api/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: id,
        })
    ).body;
    // create product
    const product = (
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
  it("creates an order", async () => {
    const res = await request
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: id,
      });
    expect(res.status).toBe(201);
  });

  // test get current order handler
  it("gets the api /orders/current-order endpoint", async () => {
    const res = await request
      .get("/api/orders/current-order")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...order, orderProducts: [] });
  });

  // test get current order handler without token
  it("gets the api /orders/current-order endpoint without token", async () => {
    const res = await request.get("/api/orders/current-order");

    expect(res.status).toBe(401);
  });

  // test change order status handler
  it("sets order status to completed", async () => {
    const res = await request
      .put(`/api/orders/${order.id}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("completed");
  });
});
