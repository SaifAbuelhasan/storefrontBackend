// tests on user model
import { UserModel, User } from "../users";

// user variable
let user: User;

describe("UserModel Tests", () => {
  // create user before all tests
  beforeAll(async () => {
    user = await UserModel.create({
      firstName: "Test",
      lastName: "User",
      password: "test123",
    });
  });
  // testing authenticate()
  it("should return a user", async () => {
    const user1 = await UserModel.authenticate("Test", "test123");
    expect(user1).toEqual(user);
  });
  // testing index()
  it("should return an array of users", async () => {
    const users = await UserModel.index();
    expect(users).toContain(user);
  });
  // testing get()
  it("should return a user", async () => {
    const user1 = await UserModel.get(1);
    expect(user1).toEqual(user);
  });
});
