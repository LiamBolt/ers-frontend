import { Router } from "express";
import { requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { evaluationSchema } from "./evaluation.schema";
import * as controller from "./evaluation.controller";

const router = Router({ mergeParams: true });
router.post("/", requireRole("INTERVIEWER"), validate(evaluationSchema), controller.submit);

export default router;
