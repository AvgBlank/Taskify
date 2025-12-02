import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function getProjectsHandler(
  req: Request<{ projectId: string }>,
  res: Response,
) {
  const { projectId } = req.params;

  try {
    const projects = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!projects) {
      return res.status(404).json({ error: "Project not found" });
    }
    return res.json({ name: projects.name, description: projects.description });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
