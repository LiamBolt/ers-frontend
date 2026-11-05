import { env } from "./config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { ExpressAuth } from "@auth/express";
import { authConfig } from "./auth/auth.config";
import { errorHandler } from "./middlewares/error";
import rootRouter from "./routes/index";

const app = express();

app.set("trust proxy", 1); // behind Render's proxy
app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(morgan(env.isProd ? "combined" : "dev"));

// Auth.js (NextAuth): /api/auth/csrf, /callback/credentials, /session, /signout.
// Must see form-encoded bodies, and must be mounted before express.json().
app.use("/api/auth", express.urlencoded({ extended: true }), ExpressAuth(authConfig));

app.use(express.json());
app.use("/api", rootRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ERS API running on port ${env.port} [${env.nodeEnv}]`);
});

export default app;
