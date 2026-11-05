import { RequestHandler } from "express";
import { send } from "../../../common/http";
import * as applications from "../applications/application.service";
import * as service from "./evaluation.service";

export const submit: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.submit(req.currentUser!, id, req.body);
    send(res, await applications.view(req.currentUser!, id), "Application updated");
  } catch (err) {
    next(err);
  }
};

