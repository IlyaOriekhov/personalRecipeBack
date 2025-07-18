import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface RequestWithUser extends Request {
  user?: { userId: number };
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded as { userId: number };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
