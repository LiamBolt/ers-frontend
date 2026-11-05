import { RequestHandler } from "express";
import { send as reply } from "../../utils/http";
import * as applications from "../applications/application.service";
import * as service from "./offer.service";

export const send: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.send(req.currentUser!, id, req.body);
    reply(res, await applications.view(req.currentUser!, id), "Offer sent", 201);
  } catch (err) {
    next(err);
  }
};

export const respond: RequestHandler = async (req, res, next) => {
  try {
    const id = String(req.params.id);
    await service.respond(req.currentUser!, id, req.body);
    reply(res, await applications.view(req.currentUser!, id), "Response recorded");
  } catch (err) {
    next(err);
  }
};
