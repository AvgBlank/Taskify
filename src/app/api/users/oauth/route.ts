import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!;
const SESSION_SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET!;
const SESSION_EXPIRY = "1y";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      }),
    }).then((res) => res.json());

    if (!tokenResponse.access_token) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 },
      );
    }

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      },
    ).then((res) => res.json());

    const { email, name } = userResponse;
    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Check if user exists
    let existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      // Generate unique user ID
      let randomId = Math.floor(1000000000 + Math.random() * 9000000000);
      while (
        await prisma.user.findUnique({ where: { id: randomId.toString() } })
      ) {
        randomId = Math.floor(1000000000 + Math.random() * 9000000000);
      }

      // Create new user
      existingUser = await prisma.user.create({
        data: {
          id: randomId.toString(),
          name: name ?? "Unknown User",
          email,
          password: null,
        },
      });
    }

    // Generate JWT session token
    const sessionToken = jwt.sign({ Id: existingUser.id }, SESSION_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    // Set session cookie
    const response = NextResponse.json({
      message: "Logged in successfully",
      user: existingUser,
    });

    response.cookies.set({
      name: "SessionToken",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 365 days
      sameSite: "lax",
    });

    response.headers.set("Location", "/dashboard");
    return new NextResponse(null, { status: 302, headers: response.headers });
  } catch (error) {
    console.error("OAuth error:", error);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
