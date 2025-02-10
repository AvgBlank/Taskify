import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SESSION_EXPIRY = "1y"; // Long-lived token
const SESSION_SECRET = process.env.SESSION_SECRET!; // Separate secret for token

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate Tokens
    const session = jwt.sign({ Id: user.id }, SESSION_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    // Set refresh token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Registered Succesfully",
    });

    response.cookies.set({
      name: "SessionToken",
      value: session,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 365 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
