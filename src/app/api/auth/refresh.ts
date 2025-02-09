import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = "1d";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: number };

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}

