import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";
import {
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  NODE_ENV,
} from "@/constants/env";

const SESSION_EXPIRY = "1y";

export default async function oauthHandler(req: Request, res: Response) {
  try {
    const { code } = req.body;
    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Invalid code" });
      return;
    }

    // Exchange code for access token
    const tokenResponse = (await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    }).then((res) => res.json())) as { access_token?: string };
    if (!tokenResponse.access_token) {
      res.status(500).json({ error: "Failed to get access token" });
      return;
    }

    // Get user info from Google
    const userResponse = (await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      },
    ).then((res) => res.json())) as { email?: string; name?: string };
    const { email, name } = userResponse;
    if (!email) {
      res.status(400).json({ error: "No email provided" });
      return;
    }

    // Check if user exists
    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      // Create new user
      existingUser = await prisma.user.create({
        data: {
          name: name ?? "Unknown User",
          email,
          password: null,
        },
      });
    }

    // Generate and set Tokens
    const session = jwt.sign({ Id: existingUser.id }, JWT_SECRET, {
      expiresIn: SESSION_EXPIRY,
    });

    res.cookie("SessionToken", session, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    res.json({ message: "Authenticated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
