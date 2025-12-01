import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { APP_ORIGIN } from "@/constants/env";
import authRoutes from "@/routes/auth.routes";
import taskRoutes from "@/routes/tasks.routes";
import projectRoutes from "@/routes/projects.routes";

const app = express();

// Configure Express
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json("Hello, World!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

export default app;
