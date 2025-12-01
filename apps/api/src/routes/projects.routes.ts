import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import getProjectsHandler from "@/controllers/projects/getProjects";
import getProjectDetailsHandler from "@/controllers/projects/getProjectDetails";
import createProjectHandler from "@/controllers/projects/createProject";
import updateProjectHandler from "@/controllers/projects/updateProject";
import deleteProjectHandler from "@/controllers/projects/deleteProject";

const projectRouter = Router();

projectRouter.get("/", authenticate, getProjectsHandler);
projectRouter.get("/:projectId", authenticate, getProjectDetailsHandler);
projectRouter.post("/", authenticate, createProjectHandler);
projectRouter.patch("/:projectId", authenticate, updateProjectHandler);
projectRouter.delete("/:projectId", authenticate, deleteProjectHandler);

export default projectRouter;
