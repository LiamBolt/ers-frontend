import { RequestHandler } from "express";
import { send } from "../../utils/http";
import * as applications from "../applications/application.service";
import * as service from "./approval.service";

export const decide: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.decide(req.currentUser!, id, req.body);
    send(res, await applications.view(req.currentUser!, id), "Application updated");
  } catch (err) {
    next(err);
  }
};

