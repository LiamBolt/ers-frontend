import { Router } from "express";
import { requireAuth, requireRole } from "../../auth/auth.middleware";
import { validate } from "../../common/middlewares/validate";
import { createJobSchema, updateJobSchema } from "./job.schema";
import * as controller from "./job.controller";

const router = Router();

// Public: power the landing page and job pages. Must stay above requireAuth and /:id.
router.get("/public", controller.listPublic);
router.get("/public/:id", controller.getPublic);

router.use(requireAuth);

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", requireRole("HR_OFFICER", "ADMIN"), validate(createJobSchema), controller.create);
router.patch("/:id", requireRole("HR_OFFICER", "ADMIN"), validate(updateJobSchema), controller.setStatus);

export default router;
