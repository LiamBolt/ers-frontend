// Recruitment state model (SRS v1 section 3.3). Names must match
// backend/src/modules/recruitment/workflow/workflow.rules.ts.
// No records live here: all data comes from the API.

export const STATES = [
  'SUBMITTED',
  'UNDER_SCREENING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'UNDER_EVALUATION',
  'SELECTED',
  'PENDING_APPROVAL',
  'OFFER_SENT',
  'OFFER_ACCEPTED',
  'ONBOARDING',
  'COMPLETED',
  'REJECTED',
  'DECLINED',
]

// The happy path, in order. REJECTED / DECLINED are closed branches (BR-05).
export const MAIN_PATH = [
  'SUBMITTED',
  'UNDER_SCREENING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'UNDER_EVALUATION',
  'SELECTED',
  'PENDING_APPROVAL',
  'OFFER_SENT',
  'OFFER_ACCEPTED',
  'ONBOARDING',
  'COMPLETED',
]

export const CLOSED_STATES = ['COMPLETED', 'REJECTED', 'DECLINED']

export const STATE_LABELS = {
  SUBMITTED: 'Submitted',
  UNDER_SCREENING: 'Under screening',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview scheduled',
  UNDER_EVALUATION: 'Under evaluation',
  SELECTED: 'Selected',
  PENDING_APPROVAL: 'Pending approval',
  OFFER_SENT: 'Offer sent',
  OFFER_ACCEPTED: 'Offer accepted',
  ONBOARDING: 'Onboarding',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  DECLINED: 'Declined',
}

// Badge variants from shared/ui/Badge.jsx
export const STATE_VARIANTS = {
  SUBMITTED: 'default',
  UNDER_SCREENING: 'default',
  SHORTLISTED: 'primary',
  INTERVIEW_SCHEDULED: 'primary',
  UNDER_EVALUATION: 'warning',
  SELECTED: 'success',
  PENDING_APPROVAL: 'warning',
  OFFER_SENT: 'primary',
  OFFER_ACCEPTED: 'success',
  ONBOARDING: 'success',
  COMPLETED: 'success',
  REJECTED: 'danger',
  DECLINED: 'danger',
}
