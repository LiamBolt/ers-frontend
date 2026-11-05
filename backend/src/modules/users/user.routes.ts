import { Router } from "express";
import { requireAuth, requireRole } from "../../auth/auth.middleware";
import { validate } from "../../common/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./user.schema";
import * as controller from "./user.controller";

const router = Router();
router.use(requireAuth, requireRole("ADMIN")); // FR-12: admin only

router.get("/", controller.list);
router.post("/", validate(createUserSchema), controller.create);
router.patch("/:id", validate(updateUserSchema), controller.update);

export default router;
