import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

export const useNotificationCount = () =>
  useQuery({ queryKey: [...keys.notifications, 'count'], queryFn: api.countNotifications, refetchInterval: 60_000 })
