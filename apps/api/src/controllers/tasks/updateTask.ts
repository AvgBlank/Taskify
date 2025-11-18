import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function updateTaskHandler(
  req: Request<{ taskId: string }>,
  res: Response,
) {
  const { taskId } = req.params;
  const { title, priority, status, labels } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        priority,
        status,
        labels: labels?.length
          ? {
              set: [],
              connectOrCreate: labels.map((label: string) => ({
                where: { name: label },
                create: { name: label },
              })),
            }
          : {},
      },
      include: { labels: true },
    });

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
