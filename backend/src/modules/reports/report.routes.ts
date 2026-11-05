import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth";
import * as controller from "./report.controller";

const router = Router();
router.get("/summary", requireAuth, requireRole("MANAGER", "ADMIN"), controller.summary);

export default router;
