import { Router } from "express";
import { requireAuth, requireRole } from "../../../auth/auth.middleware";
import { uploadCv } from "../../../config/upload";
import * as controller from "./application.controller";
import workflowRouter from "../workflow/workflow.routes";
import interviewRouter from "../interviews/interview.routes";
import evaluationRouter from "../evaluations/evaluation.routes";
import approvalRouter from "../approvals/approval.routes";
import offerRouter from "../offers/offer.routes";
import onboardingRouter from "../onboarding/onboarding.routes";

const router = Router();
router.use(requireAuth);

router.get("/", controller.list);
router.post("/", requireRole("CANDIDATE"), uploadCv.single("cv"), controller.submit);
router.get("/:id", controller.get);

// Stage actions, all under /applications/:id/...
router.use("/:id", workflowRouter);
router.use("/:id/interview", interviewRouter);
router.use("/:id/evaluations", evaluationRouter);
router.use("/:id/approval", approvalRouter);
router.use("/:id/offer", offerRouter);
router.use("/:id/onboarding", onboardingRouter);

export default router;
