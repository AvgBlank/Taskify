import { Request, Response } from "express";
import { NODE_ENV } from "@/constants/env";

export default async function logoutHandler(_req: Request, res: Response) {
  try {
    // Clear cookies
    res.clearCookie("SessionToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
