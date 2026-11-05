import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED.has(file.mimetype)) cb(null, true);
  else cb(new Error("Please upload a PDF, DOC, or DOCX file."));
};

export const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB, matches the frontend form
  fileFilter,
});
