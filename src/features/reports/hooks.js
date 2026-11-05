import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

export const useReport = (filters) =>
  useQuery({ queryKey: keys.report(filters), queryFn: () => api.getReport(filters), placeholderData: (prev) => prev })
