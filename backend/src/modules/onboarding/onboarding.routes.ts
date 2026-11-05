import { Router } from "express";
import { requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { confirmationSchema, documentSchema } from "./onboarding.schema";
import * as controller from "./onboarding.controller";

const router = Router({ mergeParams: true });
router.post("/documents", requireRole("HR_OFFICER", "ADMIN"), validate(documentSchema), controller.verifyDocument);
router.post("/confirmations", requireRole("HR_OFFICER", "ADMIN", "MANAGER"), validate(confirmationSchema), controller.confirm);
router.post("/complete", requireRole("HR_OFFICER", "ADMIN"), controller.complete);

export default router;
