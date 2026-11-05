import { RequestHandler } from "express";
import { send } from "../../utils/http";
import * as service from "./account.service";

export const register: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.register(req.body), "Registration successful", 201);
  } catch (err) {
    next(err);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.me(req.currentUser!.id), "Profile fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const panelists: RequestHandler = async (_req, res, next) => {
  try {
    send(res, await service.listPanelists(), "Panel members fetched successfully");
  } catch (err) {
    next(err);
  }
};
