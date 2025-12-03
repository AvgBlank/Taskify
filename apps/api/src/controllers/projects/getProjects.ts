import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import prisma from "@/lib/db";

export default async function getProjectsHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { searchQuery } = req.query;

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
        name: { contains: searchQuery as string, mode: "insensitive" },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
