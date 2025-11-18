import { Router } from "express";

import registerHandler from "@/controllers/auth/register";
import loginHandler from "@/controllers/auth/login";
import oauthHandler from "@/controllers/auth/oauth";
import verifyHandler from "@/controllers/auth/verify";
import logoutHandler from "@/controllers/auth/logout";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/oauth", oauthHandler);

authRoutes.get("/verify", verifyHandler);

authRoutes.delete("/logout", logoutHandler);

export default authRoutes;
