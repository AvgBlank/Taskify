import { Router } from "express";

import authenticate from "@/middlewares/authenticate";
import getTasksHandler from "@/controllers/tasks/getTasks";
import createTaskHandler from "@/controllers/tasks/createTask";
import updateTaskHandler from "@/controllers/tasks/updateTask";
import deleteTaskHandler from "@/controllers/tasks/deleteTask";

const taskRoutes = Router();

taskRoutes.get("/", authenticate, getTasksHandler);
taskRoutes.post("/", authenticate, createTaskHandler);
taskRoutes.patch("/:taskId", authenticate, updateTaskHandler);
taskRoutes.delete("/:taskId", authenticate, deleteTaskHandler);

export default taskRoutes;
