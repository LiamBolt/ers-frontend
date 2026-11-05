import { Prisma } from "@prisma/client";
import { prisma } from "../database";

type Db = Prisma.TransactionClient | typeof prisma;

// Writes to the immutable audit log (NFR-06). Insert-only by design.
export function audit(db: Db, userId: string | null, action: string, affectedRecord: string) {
  return db.auditLog.create({ data: { userId, action, affectedRecord } });
}
