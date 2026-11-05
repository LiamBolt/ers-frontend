import { RequestHandler } from "express";
import { send } from "../../common/http";
import * as service from "./notification.service";

export const list: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.list(req.currentUser!.id), "Notifications fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const count: RequestHandler = async (req, res, next) => {
  try {
    send(res, await service.countUnread(req.currentUser!.id), "Notification count fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const markAllRead: RequestHandler = async (req, res, next) => {
  try {
    await service.markAllRead(req.currentUser!.id);
    send(res, null, "All notifications marked as read");
  } catch (err) {
    next(err);
  }
};
