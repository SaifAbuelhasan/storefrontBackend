import client from "../database";

// product type
export type Product = {
  id?: number;
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
      throw new Error(`Failed to get products from database ${error}`);
    }
  }

  // get a product by id
  async get(id: number): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products WHERE id = $1";
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to get product with id ${id} from database ${error}`
      );
    }
  }

  // create a new product in the database
  async create(product: Product): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql =
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *";
      const result = await connection.query(sql, [
        product.name,
        product.price,
        product.category,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create product in database ${error}`);
    }
  }
}
