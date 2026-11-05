import { Router } from "express";
import { requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { approvalSchema } from "./approval.schema";
import * as controller from "./approval.controller";

const router = Router({ mergeParams: true });
router.post("/", requireRole("MANAGER"), validate(approvalSchema), controller.decide);

export default router;
