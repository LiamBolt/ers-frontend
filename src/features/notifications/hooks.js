import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

export const useNotificationCount = () =>
  useQuery({ queryKey: [...keys.notifications, 'count'], queryFn: api.countNotifications, refetchInterval: 60_000 })

export const useNotifications = (enabled) =>
  useQuery({ queryKey: [...keys.notifications, 'list'], queryFn: api.listNotifications, enabled })

// Both mutations just refetch the count and list afterwards.
function useRead(fn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.notifications }) })
}
export const useMarkRead = () => useRead(api.markRead)
export const useMarkAllRead = () => useRead(api.markAllRead)
