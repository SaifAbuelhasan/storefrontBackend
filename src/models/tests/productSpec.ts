// tests on product model
import { ProductModel } from "../products";

describe("ProductModel Tests", () => {
  // testing index()
  it("should return an array of products", async () => {
    const products = await ProductModel.index();
    expect(products).toBeInstanceOf(Array);
  });
  // testing create() and get()
  it("should return a product", async () => {
    const product1 = await ProductModel.create({
      name: "Test Product",
      price: 100,
      category: "Test Category",
    });

    const product2 = await ProductModel.get(product1.id as number);

    expect(product1).toEqual(product2);
  });
});
