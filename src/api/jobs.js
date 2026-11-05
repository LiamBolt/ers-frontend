import { request } from './client'

export const listJobs = () => request('/jobs')
export const createJob = (data) => request('/jobs', { method: 'POST', json: data })
