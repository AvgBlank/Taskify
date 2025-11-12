import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";
import { JWT_SECRET } from "@/constants/env";

interface TokenPayload {
  Id: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export default async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  // Extract token from cookies
  const { SessionToken: token } = req.cookies;
  if (!token) {
    res.status(401).json({ err: "AuthError" });
    return;
  }

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const name = await prisma.user.findUnique({
      where: { id: payload.Id },
      select: { name: true },
    });
    if (!name) {
      res.clearCookie("SessionToken");
      res.status(401).json({ err: "AuthError" });
      return;
    }

    req.userId = payload.Id;
    next();
  } catch {
    res.status(401).json({ err: "AuthError" });
  }
}
