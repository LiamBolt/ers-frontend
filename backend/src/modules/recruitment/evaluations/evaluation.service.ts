import { User } from "@prisma/client";
import { prisma } from "../../../database";
import { audit } from "../../../common/audit";
import { httpError } from "../../../common/http";
import { recordEvent } from "../workflow/workflow.engine";
import type { EvaluationInput } from "./evaluation.schema";

// FR-07 / BR-03: only an assigned panel member may evaluate, once, after the interview is completed.
export async function submit(user: User, id: string, input: EvaluationInput) {
  const app = await prisma.application.findUnique({
    where: { id },
    include: { interview: { include: { panel: true, evaluations: true } } },
  });
  if (!app) throw httpError(404, "Application not found");
  const interview = app.interview;

  if (app.state !== "UNDER_EVALUATION" || !interview) throw httpError(409, "Evaluations open once the interview is marked completed.");
  if (!interview.panel.some((p) => p.userId === user.id)) throw httpError(403, "You are not assigned to this interview.");
  if (interview.evaluations.some((e) => e.panelistId === user.id)) throw httpError(409, "You have already submitted an evaluation for this interview.");

  await prisma.$transaction(async (tx) => {
    await tx.evaluation.create({
      data: {
        interviewId: interview.id,
        panelistId: user.id,
        technicalScore: input.technical,
        communicationScore: input.communication,
        problemSolvingScore: input.problemSolving,
        teamworkScore: input.teamwork,
        comments: input.comments,
      },
    });
    await recordEvent(tx, id, app.state, { user }, "Evaluation submitted");
    await audit(tx, user.id, "EVALUATION_SUBMITTED", `application:${id}`);
  });
}
