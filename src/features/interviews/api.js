import { request } from '@/shared/api/client'

// Registered interview-panel members (HR and admin only), for scheduling.
export const listPanelists = () => request('/accounts/panelists')
