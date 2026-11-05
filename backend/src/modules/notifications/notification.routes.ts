import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import * as controller from "./notification.controller";

const router = Router();
router.use(requireAuth);

router.get("/", controller.list);
router.get("/count", controller.count);
router.post("/mark-all-read", controller.markAllRead);

export default router;
