import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

// verifyAuthToken middleware
export const verifyAuthToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    verify(token, tokenSecret);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};