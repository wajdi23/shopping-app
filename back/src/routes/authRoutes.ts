import { Router } from "express";
import { createAccount, login } from "../controllers/authController";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/account", authMiddleware, adminMiddleware, createAccount);

router.post("/token", login);

export default router;
