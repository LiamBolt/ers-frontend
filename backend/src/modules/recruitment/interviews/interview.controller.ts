import { RequestHandler } from "express";
import { send } from "../../../common/http";
import * as applications from "../applications/application.service";
import * as service from "./interview.service";

export const schedule: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.schedule(req.currentUser!, id, req.body);
    send(res, await applications.view(req.currentUser!, id), "Application updated");
  } catch (err) {
    next(err);
  }
};

export const complete: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.complete(req.currentUser!, id, req.body);
    send(res, await applications.view(req.currentUser!, id), "Application updated");
  } catch (err) {
    next(err);
  }
};

