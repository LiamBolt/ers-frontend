import { request } from './client'

export const listJobs = () => request('/jobs')
export const createJob = (data) => request('/jobs', { method: 'POST', json: data })

// Public (no sign-in): open vacancies for the landing page.
export const listPublicJobs = () => request('/jobs/public')
