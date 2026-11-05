import { RequestHandler } from "express";
import { send } from "../../utils/http";
import * as applications from "../applications/application.service";
import * as service from "./onboarding.service";

const handler =
  (fn: (user: NonNullable<Express.Request["currentUser"]>, id: string, body: never) => Promise<void>): RequestHandler =>
  async (req, res, next) => {
    try {
      const id = String(req.params.id);
      await fn(req.currentUser!, id, req.body as never);
      send(res, await applications.view(req.currentUser!, id), "Application updated");
    } catch (err) {
      next(err);
    }
  };

export const verifyDocument = handler(service.verifyDocument);
export const confirm = handler(service.confirm);
export const complete = handler(service.complete);
