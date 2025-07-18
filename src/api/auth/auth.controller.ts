import { Request, Response } from "express";
import prisma from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { RequestWithUser } from "../../middleware/auth.middleware";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: `Invalid credintials` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
