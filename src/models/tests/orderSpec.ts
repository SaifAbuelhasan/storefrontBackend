// tests for order model
import { OrderModel, Order, OrderProduct } from "../orders";
import { UserModel, User } from "../users";
import { ProductModel, Product } from "../products";

let user: User;
let order: Order;
let product: Product;

describe("OrderModel Tests", () => {
  // before all create new user
  beforeAll(async () => {
    // create user
    user = await UserModel.create({
      firstName: "Order",
      lastName: "Owner",
      password: "password123",
    });

    // create product
    product = await ProductModel.create({
      name: "Test Product",
      price: 100,
      category: "Test Category",
    });

    // createOrder()
    order = await OrderModel.create(user.id as number);
  });

  // testing getUserOrders()
  it("should return an array of orders", async () => {
    const orders = await OrderModel.getUserOrders(user.id as number);
    expect(orders).toContain({ ...order, orderProducts: [] });
  });

  // testing getCurrentOrder()
  it("should return user's current oder", async () => {
    const order1 = await OrderModel.getActiveOrder(user.id as number);
    expect(order1).toEqual({ orderProducts: [], ...order });
  });

  // testing createOrderProduct()
  it("should create an order product", async () => {
    const orderProduct = await OrderModel.addProduct(
      order.id as number,
      3,
      user.id as number,
      product.id as number
    );
    expect(orderProduct).toBeDefined();
  });
});
