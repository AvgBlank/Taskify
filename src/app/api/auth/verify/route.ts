import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({ valid: true, userId: payload.Id });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ valid: false });
  }
}
