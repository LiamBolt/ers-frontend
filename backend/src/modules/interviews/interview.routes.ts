import { Router } from "express";
import { requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { scheduleSchema } from "./interview.schema";
import * as controller from "./interview.controller";

const router = Router({ mergeParams: true });
router.post("/", requireRole("HR_OFFICER"), validate(scheduleSchema), controller.schedule);
router.post("/complete", requireRole("HR_OFFICER"), controller.complete);

export default router;
