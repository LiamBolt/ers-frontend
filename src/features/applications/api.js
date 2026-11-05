import { request } from '@/shared/api/client'

export const listApplications = () => request('/applications')
export const getApplication = (id) => request(`/applications/${id}`)
export const submitApplication = (formData) => request('/applications', { method: 'POST', form: formData })

// Every stage action is POST /applications/:id/<path> and answers with the refreshed application.
export const applicationAction = (id, path, json = {}) =>
  request(`/applications/${id}${path}`, { method: 'POST', json })
