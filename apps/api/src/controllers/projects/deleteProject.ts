import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function deleteProjectHandler(
  req: Request<{ projectId: string }>,
  res: Response,
) {
  const { projectId } = req.params;

  try {
    await prisma.project.delete({
      where: { id: projectId },
    });
    return res.json({ message: "Project deleted successfully" });
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
