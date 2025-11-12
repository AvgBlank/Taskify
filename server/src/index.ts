import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { APP_ORIGIN, PORT } from "./constants/env";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/tasks.routes";

const app = express();

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

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
