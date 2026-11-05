// Every TanStack Query cache key in one place, so features can invalidate each
// other's data (e.g. a stage action refreshes lists, reports and notifications).
export const keys = {
  applications: ['applications'],
  application: (id) => ['applications', id],
  jobs: ['jobs'],
  publicJobs: ['jobs', 'public'],
  publicJob: (id) => ['jobs', 'public', id],
  panelists: ['panelists'],
  report: (filters) => ['report', filters],
  notifications: ['notifications'],
  users: ['users'],
}
