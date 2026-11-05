// The stage moves a staff member (HR officer or admin) can make by hand, mirroring
// backend workflow.rules.ts. The server still decides; this only hides what it would refuse.
// `needs` names the extra input a move collects before it is sent.
const MOVES = {
  SUBMITTED: [
    { to: 'UNDER_SCREENING', label: 'Start screening' },
    { to: 'SHORTLISTED', label: 'Shortlist' },
    { to: 'REJECTED', label: 'Reject', needs: 'reason' },
  ],
  UNDER_SCREENING: [
    { to: 'SHORTLISTED', label: 'Shortlist' },
    { to: 'REJECTED', label: 'Reject', needs: 'reason' },
  ],
  SHORTLISTED: [
    { to: 'INTERVIEW_SCHEDULED', label: 'Schedule interview', needs: 'schedule' },
    { to: 'REJECTED', label: 'Reject', needs: 'reason' },
  ],
  INTERVIEW_SCHEDULED: [{ to: 'UNDER_EVALUATION', label: 'Mark interview completed' }],
  UNDER_EVALUATION: [
    { to: 'SELECTED', label: 'Select candidate', needs: 'evaluations' },
    { to: 'REJECTED', label: 'Reject', needs: 'reason' },
  ],
}

export const STAFF_ROLES = ['HR_OFFICER', 'ADMIN']

export const movesFrom = (state) => MOVES[state] ?? []
export const findMove = (state, to) => movesFrom(state).find((m) => m.to === to)
// The forward step: the first move that is not a rejection.
export const forwardMove = (state) => movesFrom(state).find((m) => m.to !== 'REJECTED')
