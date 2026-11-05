import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      /** Set by requireAuth: the authenticated, active user loaded from the DB. */
      currentUser?: User;
    }
  }
}
export {};
