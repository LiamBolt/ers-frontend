import { Router } from "express";
import { requireAuth, requireRole } from "../../auth/auth.middleware";
import { validate } from "../../common/middlewares/validate";
import { registerSchema } from "./account.schema";
import * as controller from "./account.controller";

const router = Router();

router.post("/register", validate(registerSchema), controller.register); // public
router.get("/me", requireAuth, controller.me);
router.get("/panelists", requireAuth, requireRole("HR_OFFICER", "ADMIN"), controller.panelists);

export default router;
