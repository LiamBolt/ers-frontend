import { RequestHandler } from "express";
import { send } from "../../../common/http";
import { submitApplicationSchema } from "./application.schema";
import * as service from "./application.service";

export const list: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.list(req.currentUser!), "Applications fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.get(req.currentUser!, String(req.params.id)), "Application fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const submit: RequestHandler = async (req, res, next) => {
  try {
    const input = submitApplicationSchema.parse(req.body);
    send(res, await service.submit(req.currentUser!, input, req.file), "Application submitted", 201);
  } catch (err) {
    next(err);
  }
};
