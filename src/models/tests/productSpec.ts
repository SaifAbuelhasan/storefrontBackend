// tests on product model
import { ProductModel } from "../products";

describe("ProductModel Tests", () => {
  it("should return an array of products", async () => {
    const productModel = new ProductModel();
    const products = await productModel.index();
    expect(products).toBeInstanceOf(Array);
  });
});
