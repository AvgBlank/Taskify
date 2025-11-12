import { Request, Response } from "express";

export default async function logoutHandler(_req: Request, res: Response) {
  try {
    // Clear cookies
    res.clearCookie("SessionToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
