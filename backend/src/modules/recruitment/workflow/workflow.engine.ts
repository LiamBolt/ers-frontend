import { ApplicationState, Prisma, User } from "@prisma/client";
import { audit } from "../../../common/audit";
import { httpError } from "../../../common/http";
import { isLegalMove, moveExists } from "./workflow.rules";

export type Actor = { user: User } | "SYSTEM";

const STATE_LABEL = (s: string) => s.toLowerCase().replace(/_/g, " ");

/**
 * The one place an application's state changes. Validates the move against the
 * rules table, persists the new state (BR-02), appends a history row (BR-04)
 * and writes an audit entry (NFR-06). Must run inside a transaction.
 */
export async function moveState(
  tx: Prisma.TransactionClient,
  applicationId: string,
  to: ApplicationState,
  actor: Actor,
  note = ""
) {
  const app = await tx.application.findUnique({ where: { id: applicationId } });
  if (!app) throw httpError(404, "Application not found");

  const role = actor === "SYSTEM" ? "SYSTEM" : actor.user.role;
  if (!isLegalMove(role, app.state, to)) {
    const msg = moveExists(app.state, to)
      ? `A ${String(role).toLowerCase().replace("_", " ")} cannot move an application from ${STATE_LABEL(app.state)} to ${STATE_LABEL(to)}.`
      : `Illegal transition: ${STATE_LABEL(app.state)} to ${STATE_LABEL(to)}.`;
    throw httpError(moveExists(app.state, to) ? 403 : 409, msg);
  }

  await tx.application.update({ where: { id: applicationId }, data: { state: to } });
  await recordEvent(tx, applicationId, to, actor, note);
  await audit(tx, actor === "SYSTEM" ? null : actor.user.id, `STATE ${app.state} -> ${to}`, `application:${applicationId}`);
}

/** Appends a history row without changing state (evaluations, approvals, onboarding steps). */
export function recordEvent(
  tx: Prisma.TransactionClient,
  applicationId: string,
  state: ApplicationState,
  actor: Actor,
  note = ""
) {
  return tx.applicationHistory.create({
    data: {
      applicationId,
      state,
      note,
      actorId: actor === "SYSTEM" ? null : actor.user.id,
      actorName: actor === "SYSTEM" ? "System" : actor.user.name,
      actorRole: actor === "SYSTEM" ? "SYSTEM" : actor.user.role,
    },
  });
}
