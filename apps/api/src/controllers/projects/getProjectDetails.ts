import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function getProjectDetailsHandler(
  req: Request<{ projectId: string }>,
  res: Response,
) {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project Id is required" });
    }

    const projects = await prisma.project.findMany({
      where: { id: projectId },
      include: {
        tasks: true,
      },
    });

    return res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
