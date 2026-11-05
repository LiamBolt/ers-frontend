import { prisma } from "../../database";

export const list = (userId: string) =>
  prisma.notification.findMany({ where: { recipientId: userId }, orderBy: { sentAt: "desc" }, take: 50 });

export const countUnread = async (userId: string) => ({
  unread: await prisma.notification.count({ where: { recipientId: userId, readAt: null } }),
});

export async function markAllRead(userId: string) {
  await prisma.notification.updateMany({ where: { recipientId: userId, readAt: null }, data: { readAt: new Date() } });
}

export async function markRead(userId: string, id: string) {
  await prisma.notification.updateMany({ where: { id, recipientId: userId, readAt: null }, data: { readAt: new Date() } });
}
