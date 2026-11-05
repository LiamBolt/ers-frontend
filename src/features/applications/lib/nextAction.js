// States where one role is simply waiting on HR: [role, label].
const WAITING_ON = {
  SUBMITTED: ['HR_OFFICER', 'Start screening'],
  UNDER_SCREENING: ['HR_OFFICER', 'Shortlist or reject'],
  SHORTLISTED: ['HR_OFFICER', 'Schedule interview'],
  INTERVIEW_SCHEDULED: ['HR_OFFICER', 'Mark interview completed'],
  SELECTED: ['SYSTEM', ''],
  OFFER_SENT: ['HR_OFFICER', 'Awaiting candidate response'],
  ONBOARDING: ['HR_OFFICER', 'Collect confirmations'],
}

// What the signed-in user needs to do next on an application ('' = nothing).
export function nextAction(app, user) {
  const role = user.role

  if (app.state === 'UNDER_EVALUATION') {
    if (role === 'INTERVIEWER') {
      const onPanel = app.interview?.panel.some((p) => p.id === user.id)
      const done = app.evaluations.some((e) => e.panelistId === user.id)
      return onPanel && !done ? 'Submit your evaluation' : ''
    }
    if (role === 'HR_OFFICER') return `${app.evaluations.length}/${app.interview.panel.length} evaluations in`
    return ''
  }
  if (app.state === 'PENDING_APPROVAL') {
    if (!app.approval) return role === 'MANAGER' ? 'Approve or reject' : ''
    return role === 'HR_OFFICER' ? 'Send offer' : ''
  }
  if (app.state === 'ONBOARDING' && role === 'MANAGER') {
    return app.onboarding?.confirmations.Department ? '' : 'Confirm department'
  }

  const waiting = WAITING_ON[app.state]
  return waiting && waiting[0] === role ? waiting[1] : ''
}
