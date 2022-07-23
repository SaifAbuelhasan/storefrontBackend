import { OrderModel } from "../models/orders";
import express, { Request, Response } from "express";
import { verifyAuthToken } from "../helpers/verifyJWT";

// show current order handler
export const show = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.getActiveOrder(req.userId as number);
    res.status(200).json(order);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// change order status handler
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.orderCompleted(
      +orderId,
      req.userId as number
    );
    res.status(200).json(order);
  } catch (error) {
    const e = error as Error;
    // return forbidden if user is not the owner of the order
    if (e.message === "You are not the owner of this order") {
      res.status(403).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
};

// create product-order handler
export const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.order;
    const orderProduct = await OrderModel.addProduct(
      +orderId,
      req.body.quantity,
      req.userId as number,
      req.body.productId
    );
    res.status(200).json(orderProduct);
  } catch (error) {
    const e = error as Error;
    // return forbidden if user is not the owner of the order
    if (e.message === "You are not the owner of this order") {
      res.status(403).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
};

// show current user's orders handler
export const showOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.getUserOrders(req.userId as number);
    res.status(200).json(orders);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// create new order handler
export const create = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.create(req.userId as number);
    res.status(201).json(order);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

/**
 * creates orders endpoints for the app
 * @param app express app
 */
const order_routes = (app: express.Application) => {
  app.route("/api/orders/current-order").get(verifyAuthToken, show);
  app.route("/api/orders/:id/complete").put(verifyAuthToken, changeStatus);
  app.route("/api/orders").post(verifyAuthToken, create);
  app.route("/api/orders/:order/products").post(verifyAuthToken, addProduct);
  app.route("/api/orders").get(verifyAuthToken, showOrders);
};

export default order_routes;
