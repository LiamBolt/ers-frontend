import { RequestHandler } from "express";
import { send } from "../../common/http";
import { reportQuerySchema } from "./report.schema";
import * as service from "./report.service";

export const summary: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.summary(reportQuerySchema.parse(req.query)), "Report generated successfully");
  } catch (err) {
    next(err);
  }
};
