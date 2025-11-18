import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import prisma from "@/lib/db";

export default async function getTasksHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { labels: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
