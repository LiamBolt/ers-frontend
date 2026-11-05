import { request } from './client'

export const listUsers = () => request('/users')
export const createUser = (data) => request('/users', { method: 'POST', json: data })
export const updateUser = (id, data) => request(`/users/${id}`, { method: 'PATCH', json: data })
