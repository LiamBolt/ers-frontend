// Whether this interview needs the signed-in user to act, by role:
// panel member -> an evaluation is due; HR -> the interview must be closed out.
export const evaluatedBy = (application, userId) => application.evaluations.some((e) => e.panelistId === userId)

export function needsAction(application, user) {
  if (user.role === 'INTERVIEWER') return application.state === 'UNDER_EVALUATION' && !evaluatedBy(application, user.id)
  if (user.role === 'HR_OFFICER') return application.state === 'INTERVIEW_SCHEDULED'
  return false
}

// The four tabs on the Interviews page.
export function groupInterviews(interviews, user) {
  return {
    ACTION: interviews.filter((a) => needsAction(a, user)),
    UPCOMING: interviews.filter((a) => a.interview.status === 'SCHEDULED'),
    COMPLETED: interviews.filter((a) => a.interview.status === 'COMPLETED'),
    ALL: interviews,
  }
}
