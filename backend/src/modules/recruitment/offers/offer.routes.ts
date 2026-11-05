import { Router } from "express";
import { requireRole } from "../../../auth/auth.middleware";
import { validate } from "../../../common/middlewares/validate";
import { offerResponseSchema, offerSchema } from "./offer.schema";
import * as controller from "./offer.controller";

const router = Router({ mergeParams: true });
router.post("/", requireRole("HR_OFFICER"), validate(offerSchema), controller.send);
router.post("/response", requireRole("HR_OFFICER", "CANDIDATE"), validate(offerResponseSchema), controller.respond);

export default router;
