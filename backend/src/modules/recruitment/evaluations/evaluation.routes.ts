import { Router } from "express";
import { requireRole } from "../../../auth/auth.middleware";
import { validate } from "../../../common/middlewares/validate";
import { evaluationSchema } from "./evaluation.schema";
import * as controller from "./evaluation.controller";

const router = Router({ mergeParams: true });
router.post("/", requireRole("INTERVIEWER", "ADMIN"), validate(evaluationSchema), controller.submit);

export default router;
