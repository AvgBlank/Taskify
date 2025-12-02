import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import prisma from "@/lib/db";

export default async function getTasksHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.userId;
    const { projectId } = req.query;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { searchQuery, status, priority, skip, order } = req.query;
    console.log(req.query);

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        projectId: projectId as string,
        title: { contains: (searchQuery as string) || "", mode: "insensitive" },
        status: status == "All" ? undefined : (status as string) || undefined,
        priority:
          priority == "All" ? undefined : (priority as string) || undefined,
      },
      include: { labels: true },
      orderBy: {
        createdAt: (order as "asc" | "desc") || "desc",
      },
    });

    const pages = Math.ceil(tasks.length / 10);
    const totalTasks = tasks.length;
    const final = tasks.slice(
      parseInt(skip as string) || 0,
      (parseInt(skip as string) || 0) + 10,
    );

    return res.json([final, pages, totalTasks]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
