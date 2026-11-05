import type { ExpressAuthConfig } from "@auth/express";
import Credentials from "@auth/express/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../database";
import { env } from "../config/env";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

// Auth.js (NextAuth) running on Express: credentials login, JWT session cookie.
// Mounted at /api/auth (csrf, callback/credentials, session, signout).
export const authConfig: ExpressAuthConfig = {
  basePath: "/api/auth",
  trustHost: true,
  secret: env.authSecret,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user || user.status !== "ACTIVE") return null; // deactivated accounts cannot log in (FR-12)
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    // The token only carries the user id. Role and status are always re-read
    // from the database in requireAuth so they can never be stale or forged.
    jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    session({ session, token }) {
      (session.user as unknown as { id?: unknown }).id = token.uid;
      return session;
    },
  },
};
