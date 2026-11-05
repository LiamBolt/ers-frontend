// The stage tabs on the Candidates page, each covering a set of states.
export const STAGE_GROUPS = [
  { value: 'ALL', label: 'All', states: null },
  { value: 'SCREENING', label: 'Screening', states: ['SUBMITTED', 'UNDER_SCREENING'] },
  { value: 'INTERVIEW', label: 'Interview', states: ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'UNDER_EVALUATION'] },
  { value: 'APPROVAL', label: 'Approval', states: ['SELECTED', 'PENDING_APPROVAL'] },
  { value: 'OFFER', label: 'Offer & onboarding', states: ['OFFER_SENT', 'OFFER_ACCEPTED', 'ONBOARDING'] },
  { value: 'CLOSED', label: 'Closed', states: ['COMPLETED', 'REJECTED', 'DECLINED'] },
]
