import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import prisma from "@/lib/db";

export default async function createTaskHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, priority, status, labels } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        priority,
        status,
        userId,
        labels: labels?.length
          ? {
              connectOrCreate: labels.map((label: string) => ({
                where: { name: label },
                create: { name: label },
              })),
            }
          : {},
      },
      include: { labels: true },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
