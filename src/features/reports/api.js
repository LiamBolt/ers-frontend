import { request } from '@/shared/api/client'

export const getReport = (filters) => request('/reports/summary', { query: filters })
