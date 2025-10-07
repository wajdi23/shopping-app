import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token expiré" });
  }
};
