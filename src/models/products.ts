import client from "../database";

// product type
export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

// product model
export class ProductModel {
  // index of the products in the database
  async index(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error("Failed to get products from database");
    }
  }
}
