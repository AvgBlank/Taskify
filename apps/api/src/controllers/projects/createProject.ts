import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import prisma from "@/lib/db";

export default async function createProjectHandler(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, description } = req.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description.trim() || undefined,
        userId,
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
