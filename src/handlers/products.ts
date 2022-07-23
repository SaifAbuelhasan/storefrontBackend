import { ProductModel } from "../models/products";
import express, { Request, Response } from "express";
import { verifyAuthToken } from "../helpers/verifyJWT";

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

// create handler
export const create = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
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

// get top 5 handler
export const top5 = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.getTop5();
    res.status(200).json(products);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// get products by category handler
export const getByCategory = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.getByCategory(req.params.category);
    res.status(200).json(products);
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
  app.route("/api/products").post(verifyAuthToken, create);
  app.route("/api/products/:id").get(show);
  app.route("/api/products/top5").get(top5);
  app.route("/api/products/:category").get(getByCategory);
};

export default product_routes;
