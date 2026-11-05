import { request } from '@/shared/api/client'

export const listNotifications = () => request('/notifications')
export const countNotifications = () => request('/notifications/count')
export const markAllRead = () => request('/notifications/mark-all-read', { method: 'POST' })
export const markRead = (id) => request(`/notifications/${id}/read`, { method: 'POST' })
