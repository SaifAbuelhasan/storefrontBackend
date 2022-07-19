import server from "../../server";
import supertest from "supertest";
import { UserModel } from "../../models/users";

const request = supertest(server);

let token: string;
let id: number;

describe("Test users handler", () => {
  // create a user before all
  beforeAll(async () => {
    // signup user
    const res = await request.post("/api/users/signup").send({
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    });

    id = (await request.get("/api/users")).body.length;
    // get the token
    token = res.body.token;
  });

  // test index handler
  it("gets the api/users endpoint", async () => {
    const res = await request.get("/api/users");
    expect(res.status).toBe(200);
  });

  // test show handler
  it("gets the api/users/:id endpoint", async () => {
    // get request with token as authorization header
    const res = await request
      .get(`/api/users/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // test show user without token
  it("gets the api/users/:id endpoint without token", async () => {
    const res = await request.get(`/api/users/${id}`);
    expect(res.status).toBe(401);
  });

  // test authenticate handler
  it("authenticates a user", async () => {
    const res = await request.post("/api/users/login").send({
      firstName: "John",
      lastName: "Doe",
      password: "password123",
    });
    expect(res.status).toBe(200);
  });
});
