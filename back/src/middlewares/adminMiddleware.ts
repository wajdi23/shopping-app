import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user);

  if (!req.user) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  if (req.user.email !== "admin@admin.com") {
    return res.status(403).json({
      error: "Accès refusé. vous n etes pas Admin",
    });
  }

  next();
};
