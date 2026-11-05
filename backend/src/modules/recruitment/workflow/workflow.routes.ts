import { Router } from "express";
import { requireRole } from "../../../auth/auth.middleware";
import { validate } from "../../../common/middlewares/validate";
import { transitionSchema } from "./workflow.schema";
import * as controller from "./workflow.controller";

// Mounted under /applications/:id (mergeParams). Role per move is enforced by
// workflow.rules.ts; this gate only keeps candidates/managers out of the route.
const router = Router({ mergeParams: true });
router.post("/transition", requireRole("HR_OFFICER", "ADMIN", "INTERVIEWER"), validate(transitionSchema), controller.transition);

export default router;
