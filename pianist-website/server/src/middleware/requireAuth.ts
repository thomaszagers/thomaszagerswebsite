import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}