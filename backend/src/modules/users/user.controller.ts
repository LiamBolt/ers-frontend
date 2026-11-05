import { RequestHandler } from "express";
import { send } from "../../utils/http";
import * as service from "./user.service";

export const list: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.list(typeof req.query.role === "string" ? req.query.role : undefined), "Users fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.create(req.currentUser!.id, req.body), "User created", 201);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.update(req.currentUser!.id, String(req.params.id), req.body), "User updated");
  } catch (err) {
    next(err);
  }
};
