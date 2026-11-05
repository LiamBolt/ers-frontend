import { RequestHandler } from "express";
import { send } from "../../utils/http";
import * as service from "./job.service";

export const list: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.list(req.currentUser!), "Vacancies fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const get: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.get(req.currentUser!, String(req.params.id)), "Vacancy fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.create(req.currentUser!, req.body), "Vacancy published", 201);
  } catch (err) {
    next(err);
  }
};

export const setStatus: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.setStatus(req.currentUser!, String(req.params.id), req.body.status), "Vacancy updated");
  } catch (err) {
    next(err);
  }
};
