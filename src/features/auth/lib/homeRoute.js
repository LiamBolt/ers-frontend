// Where a user lands right after signing in or registering.
// `job` is set when they arrived via "Apply" on a vacancy, so the application
// form opens with that vacancy already selected.
export function homeRoute(user, job) {
  if (user.role === 'CANDIDATE') return job ? `/candidate?job=${encodeURIComponent(job)}` : '/candidate'
  if (user.role === 'HR_OFFICER') return '/vacancy'
  return '/'
}
