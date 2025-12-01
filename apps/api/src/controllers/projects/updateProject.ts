import { Request, Response } from "express";
import prisma from "@/lib/db";

export default async function updateProjectHandler(
  req: Request<{ projectId: string }>,
  res: Response,
) {
  const { projectId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });

    return res.json(updatedProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
