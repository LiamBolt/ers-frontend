import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

// The server already scopes each list to what the signed-in role may see.
export const useApplications = () => useQuery({ queryKey: keys.applications, queryFn: api.listApplications })

export const useApplication = (id) =>
  useQuery({ queryKey: keys.application(id), queryFn: () => api.getApplication(id), enabled: !!id })

// Applies one stage move to many applications, one request each (the server
// checks every move), and reports how many went through and which did not.
export function useBulkMove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ ids, to, note }) => {
      const results = await Promise.allSettled(ids.map((id) => api.applicationAction(id, '/transition', { to, note })))
      return { moved: results.filter((r) => r.status === 'fulfilled').length, failed: results.filter((r) => r.status === 'rejected').length }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.applications })
      queryClient.invalidateQueries({ queryKey: ['report'] })
      queryClient.invalidateQueries({ queryKey: keys.notifications })
    },
  })
}
