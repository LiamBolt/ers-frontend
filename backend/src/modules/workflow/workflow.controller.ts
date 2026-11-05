import { RequestHandler } from "express";
import { send } from "../../utils/http";
import { toApplicationView } from "../applications/application.serializer";
import * as service from "./workflow.service";

export const transition: RequestHandler = async (req, res, next) => {
  try {
    const app = await service.transition(req.currentUser!, String(req.params.id), req.body);
    send(res, toApplicationView(app!), "Application updated");
  } catch (err) {
    next(err);
  }
};
