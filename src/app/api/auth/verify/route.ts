import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

type TokenPayload = {
  Id: number;
  iat?: number;
  exp?: number;
};

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("SessionToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ valid: false });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.SESSION_SECRET as string,
    ) as TokenPayload;

    const name = await prisma.user.findUnique({
      where: { id: payload.Id },
      select: { name: true },
    });

    return NextResponse.json({
      valid: true,
      userId: payload.Id,
      name: name?.name,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ valid: false });
  }
}
