import { Router } from "express";
import accountRouter from "../modules/accounts/account.routes";
import userRouter from "../modules/users/user.routes";
import jobRouter from "../modules/jobs/job.routes";
import applicationRouter from "../modules/applications/application.routes";
import notificationRouter from "../modules/notifications/notification.routes";
import reportRouter from "../modules/reports/report.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date().toISOString() });
});

// Auth.js itself is mounted at /api/auth in index.ts.
router.use("/accounts", accountRouter);
router.use("/users", userRouter);
router.use("/jobs", jobRouter);
router.use("/applications", applicationRouter);
router.use("/notifications", notificationRouter);
router.use("/reports", reportRouter);

export default router;
