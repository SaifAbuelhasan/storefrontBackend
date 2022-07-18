import { ProductModel } from "../models/products";
import express, { Request, Response } from "express";

// index handler
export const index = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.index();
    res.status(200).json(products);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// show handler
export const show = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.get(+req.params.id);
    res.status(200).json(product);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

/**
 * creates products endpoints for the app
 * @param app express app
 */
const product_routes = (app: express.Application) => {
  app.route("/api/products").get(index);
  app.route("/api/products/:id").get(show);
};

export default product_routes;
