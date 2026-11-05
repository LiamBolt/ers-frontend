import { Prisma } from "@prisma/client";

export function notify(
  tx: Prisma.TransactionClient,
  recipientIds: string[],
  message: string,
  type: string,
  link?: string
) {
  if (!recipientIds.length) return Promise.resolve();
  return tx.notification.createMany({
    data: [...new Set(recipientIds)].map((recipientId) => ({ recipientId, message, type, link })),
  });
}

export async function idsWithRole(tx: Prisma.TransactionClient, role: "HR_OFFICER" | "MANAGER" | "ADMIN") {
  const users = await tx.user.findMany({ where: { role, status: "ACTIVE" }, select: { id: true } });
  return users.map((u) => u.id);
}

/** Candidate-facing message: the default wording plus the staff member's optional note. */
export const withNote = (message: string, note?: string) => (note?.trim() ? `${message}. Note from the team: ${note.trim()}` : message);
