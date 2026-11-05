import { RequestHandler } from "express";
import { getSession } from "@auth/express";
import { UserRole } from "@prisma/client";
import { authConfig } from "../auth/auth.config";
import { prisma } from "../db";
import { audit } from "../utils/audit";

// Validates the Auth.js session cookie, then loads the live user record.
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await getSession(req, authConfig);
    const uid = (session as unknown as { user?: { id?: string } } | null)?.user?.id;
    if (!uid) {
      res.status(401).json({ success: false, message: "Unauthorized: please sign in" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user || user.status !== "ACTIVE") {
      res.status(401).json({ success: false, message: "Unauthorized: account is not active" });
      return;
    }
    req.currentUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Server-side role gate (BR-03 / NFR-04). Every refusal is audit-logged.
export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return async (req, res, next) => {
    const user = req.currentUser;
    if (!user || !roles.includes(user.role)) {
      await audit(prisma, user?.id ?? null, `AUTHORIZATION_DENIED ${req.method} ${req.originalUrl}`, user?.role ?? "anonymous").catch(
        () => undefined
      );
      res.status(403).json({ success: false, message: `Forbidden: requires role ${roles.join(" or ")}` });
      return;
    }
    next();
  };
};
