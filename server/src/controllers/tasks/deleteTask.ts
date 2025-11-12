import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function deleteTaskHandler(
  req: Request<{ taskId: string }>,
  res: Response,
) {
  const { taskId } = req.params;

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    return res.json({ message: "Task deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
