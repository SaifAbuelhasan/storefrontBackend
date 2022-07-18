// users handler
import { UserModel } from "../models/users";
import express, { Request, Response } from "express";
import { verifyAuthToken } from "../helpers/verifyJWT";
import { sign } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

// index handler
export const index = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.index();
    res.status(200).json(users);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// show handler.
export const show = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.get(+req.params.id);
    res.status(200).json(user);
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// create handler.
export const create = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    // create a token for the user
    const token = sign({ id: user.id }, tokenSecret);
    res.status(201).json({ token: token });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// login handler
export const login = async (req: Request, res: Response) => {
  try {
    const { firstName, password } = req.body;
    const user = await UserModel.authenticate(firstName, password);
    if (user) {
      // create a token for the user
      const token = sign({ id: user.id }, tokenSecret);
      res.status(200).json(token);
      return;
    }
    res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

/**
 * creates users endpoints for the app
 * @param app express app
 */
const user_routes = (app: express.Application) => {
  app.route("/api/users").get(index);
  app.route("/api/users/:id").get(verifyAuthToken, show);
  app.route("/api/users/signup").post(create);
  app.route("/api/users/login").post(login);
};

export default user_routes;
