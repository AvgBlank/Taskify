import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";
import { JWT_SECRET, NODE_ENV } from "@/constants/env";

const SESSION_EXPIRY = "1y";

export default async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Verify password
    if (!user.password) {
      res.status(401).json({ error: "Please login using google" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate and set Tokens
    const session = jwt.sign({ Id: user.id }, JWT_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    res.cookie("SessionToken", session, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
