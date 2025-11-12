import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";
import { JWT_SECRET, NODE_ENV } from "@/constants/env";

const SESSION_EXPIRY = "1y";

export default async function registerHandler(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check if user already exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate and set Tokens
    const session = jwt.sign({ Id: newUser.id }, JWT_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    res.cookie("SessionToken", session, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
