import { Response } from "express";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const httpError = (status: number, message: string) => new HttpError(status, message);

export function send<T>(res: Response, data: T, message = "OK", status = 200) {
  res.status(status).json({ success: true, message, data });
}
