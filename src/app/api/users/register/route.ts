import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const ACCESS_TOKEN_EXPIRY = "1d"; // Short-lived token
const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived refresh token
const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!; // Separate secret for refresh tokens

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if email doesn't already exist
    const checkEmail = await prisma.user.findUnique({ where: { email } });
    if (checkEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Get number of users
    const usersCount = await prisma.user.count();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: usersCount + 1,
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate Access and Refresh Tokens
    const accessToken = jwt.sign({ Id: usersCount + 1 }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ Id: usersCount + 1 }, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // Set refresh token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Registered Succesfully",
      accessToken,
      user: newUser,
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to register user" },
      { status: 500 },
    );
  }
}
