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
  /**
   * Get all products from database
   * @returns {Promise<Product[]>} array of all products
   */
  static async index(): Promise<Product[]> {
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

  /**
   * Get product by id from database
   * @param id product id
   * @returns {Promise<Product>} product object
   */
  static async get(id: number): Promise<Product> {
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

  /**
   * Get top 5 most popular products from database
   * @returns {Promise<Product[]>} array of top 5 most popular products
   */
  static async getTop5(): Promise<Product[]> {
    try {
      const connection = await client.connect();
      // query to get top 5 most popular products by order_products table
      const sql = `
        SELECT products.*, COUNT(order_products.product_id) AS popularity
        FROM products
        LEFT JOIN order_products ON products.id = order_products.product_id
        GROUP BY products.id
        ORDER BY popularity DESC
        LIMIT 5
      `;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get top 5 products from database ${error}`);
    }
  }

  /**
   * Get products by category from database
   * @param category product category
   * @returns {Promise<Product[]>} array of products
   */
  static async getByCategory(category: string): Promise<Product[]> {
    try {
      const connection = await client.connect();
      const sql = "SELECT * FROM products WHERE category = $1";
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Failed to get products by category ${category} from database ${error}`
      );
    }
  }

  /**
   * Add new product to database
   * @param product Product object
   * @returns {Promise<Product>} created product object
   */
  static async create(product: Product): Promise<Product> {
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
