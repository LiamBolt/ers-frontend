import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { HttpError } from "../utils/http";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(422).json({ success: false, message: "Validation failed", errors: err.flatten().fieldErrors });
    return;
  }
  if (err instanceof multer.MulterError) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ success: false, message: err.message });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(409).json({ success: false, message: "A record with these details already exists" });
    return;
  }
  console.error(err);
  const message =
    process.env.NODE_ENV !== "production" && err instanceof Error && err.message ? err.message : "An unexpected error occurred";
  res.status(500).json({ success: false, message });
}
