import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";
import { JWT_SECRET } from "@/constants/env";

type TokenPayload = {
  Id: string;
  iat?: number;
  exp?: number;
};

export default async function verifyHandler(req: Request, res: Response) {
  // Extract token from cookies
  const { SessionToken: token } = req.cookies;
  if (!token) {
    res.status(401).json({ valid: false });
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
      res.json({ valid: false });
      return;
    }
    res.json({ valid: true, userId: payload.Id, name: name?.name });
  } catch {
    res.status(401).json({ valid: false });
  }
}
