import { request } from './client'

export const listNotifications = () => request('/notifications')
export const countNotifications = () => request('/notifications/count')
export const markAllRead = () => request('/notifications/mark-all-read', { method: 'POST' })
