import { QueryResult } from "pg";
import client from "../database";

export type Order = {
  id?: number;
  userId: number;
  status: string;
  orderProducts?: Array<{
    productId: number;
    quantity: number;
  }>;
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
      // get user's orders
      const sql = `SELECT * FROM orders WHERE user_id = $1`;
      const result = await connection.query(sql, [userId]);
      // get order products
      const orders = await Promise.all(
        result.rows.map(async (order) => {
          const sql = `SELECT product_id, quantity FROM order_products WHERE order_id = $1`;
          const orderProducts = await connection.query(sql, [order.id]);
          return {
            ...order,
            orderProducts: orderProducts.rows,
          };
        })
      );
      connection.release();
      return orders;
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
      // get order products
      const products = await connection.query(
        `SELECT product_id, quantity FROM order_products WHERE order_id = $1`,
        [result.rows[0].id]
      );
      const order = {
        ...result.rows[0],
        orderProducts: products.rows,
      };
      connection.release();
      return order;
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
   * @param userId user id
   * @returns {Promise<Order>} updated order
   */
  static async orderCompleted(orderId: number, userId: number): Promise<Order> {
    try {
      const connection = await client.connect();
      // check that user is the order owner
      const sql1 = `SELECT status, user_id FROM orders WHERE id = $1`;
      const result1 = await connection.query(sql1, [orderId]);
      if (result1.rows[0].user_id !== userId) {
        throw new Error("You are not the owner of this order");
      }

      const sql = `UPDATE orders SET status = 'completed' WHERE id = $1 RETURNING *`;
      const result = await connection.query(sql, [orderId]);
      // get order products
      const products = await connection.query(
        `SELECT product_id, quantity FROM order_products WHERE order_id = $1`,
        [result.rows[0].id]
      );
      const order = {
        ...result.rows[0],
        orderProducts: products.rows,
      };
      connection.release();
      return order;
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
    userId: number,
    productId: number
  ): Promise<OrderProduct> {
    try {
      const connection = await client.connect();
      // check that order is active
      const sql = `SELECT status, user_id FROM orders WHERE id = $1`;
      const result = await connection.query(sql, [orderId]);
      if (result.rows[0].user_id !== userId) {
        throw new Error("You are not the owner of this order");
      }

      if (result.rows[0].status !== "active") {
        throw new Error("Order is not active");
      }
      // check that product exists
      const sql2 = `SELECT * FROM products WHERE id = $1`;
      const result2 = await connection.query(sql2, [productId]);
      if (!result2.rows[0]) {
        throw new Error("Product does not exist");
      }
      const sql3 = `INSERT INTO order_products (order_id, quantity, product_id) VALUES ($1, $2, $3) RETURNING *`;
      const result3 = await connection.query(sql3, [
        orderId,
        quantity,
        productId,
      ]);
      connection.release();
      return result3.rows[0];
    } catch (error) {
      throw new Error(`Failed to add product to order in database ${error}`);
    }
  }
}
