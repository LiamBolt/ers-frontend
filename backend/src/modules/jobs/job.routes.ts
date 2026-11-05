import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createJobSchema, updateJobSchema } from "./job.schema";
import * as controller from "./job.controller";

const router = Router();

// Public: powers the landing page. Must stay above requireAuth and /:id.
router.get("/public", controller.listPublic);

router.use(requireAuth);

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", requireRole("HR_OFFICER", "ADMIN"), validate(createJobSchema), controller.create);
router.patch("/:id", requireRole("HR_OFFICER", "ADMIN"), validate(updateJobSchema), controller.setStatus);

export default router;
