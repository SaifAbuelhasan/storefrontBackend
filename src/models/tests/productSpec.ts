// tests on product model
import { ProductModel } from "../products";

describe("ProductModel Tests", () => {
  // testing index()
  it("should return an array of products", async () => {
    const productModel = new ProductModel();
    const products = await productModel.index();
    expect(products).toBeInstanceOf(Array);
  });
  // testing create() and get()
  it("should return a product", async () => {
    const productModel = new ProductModel();
    const product1 = await productModel.create({
      name: "Test Product",
      price: 100,
      category: "Test Category",
    });

    const product2 = await productModel.get(1);

    expect(product1).toEqual(product2);
  });
});
