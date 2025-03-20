import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const SESSION_EXPIRY = "1y";
const SESSION_SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET!;

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate Tokens
    const session = jwt.sign({ Id: newUser.id }, SESSION_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    // Set refresh token as an HTTP-only cookie
    const response = NextResponse.json({
      message: "Registered Succesfully",
      user: newUser,
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: typeof error === "string" ? error : "Failed to register user" },
      { status: 500 },
    );
  }
}
