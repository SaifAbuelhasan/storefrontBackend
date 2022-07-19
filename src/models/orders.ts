import { QueryResult } from "pg";
import client from "../database";

export type Order = {
  id?: number;
  userId: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  orderId: number;
  quantity: number;
  productId: number;
};

export class OrderModel {
  /**
   * get user orders from database
   * @param userId user id
   * @returns {Promise<Order[]>} array of user orders
   */
  static async getUserOrders(userId: number): Promise<Order[]> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get user orders from database ${error}`);
    }
  }

  /**
   * get user's active order from database
   * @param userId user id
   * @returns {Promise<Order>} user's active order
   */
  static async getActiveOrder(userId: number): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM orders WHERE user_id = $1 AND status = 'active'`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Failed to get user's active order from database ${error}`
      );
    }
  }

  /**
   * create new order in database
   * @param userId user id
   * @returns {Promise<Order>} created order
   */
  static async create(userId: number): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = `INSERT INTO orders (user_id, status) VALUES ($1, 'active') RETURNING *`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create order in database ${error}`);
    }
  }

  /**
   * update order status in database
   * @param orderId order id
   * @returns {Promise<Order>} updated order
   */
  static async orderCompleted(orderId: number): Promise<Order> {
    try {
      const connection = await client.connect();
      const sql = `UPDATE orders SET status = 'completed' WHERE id = $1 RETURNING *`;
      const result = await connection.query(sql, [orderId]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update order status in database ${error}`);
    }
  }

  /**
   * add product to order in database
   * @param orderId order id
   * @param quantity product quantity
   * @param productId product id
   * @returns {Promise<OrderProduct>} updated order
   */
  static async addProduct(
    orderId: number,
    quantity: number,
    productId: number
  ): Promise<OrderProduct> {
    try {
      const connection = await client.connect();
      const sql = `INSERT INTO order_products (order_id, quantity, product_id) VALUES ($1, $2, $3) RETURNING *`;
      const result = await connection.query(sql, [
        orderId,
        quantity,
        productId,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to add product to order in database ${error}`);
    }
  }
}
