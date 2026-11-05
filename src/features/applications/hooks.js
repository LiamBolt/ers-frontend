import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

// The server already scopes each list to what the signed-in role may see.
export const useApplications = () => useQuery({ queryKey: keys.applications, queryFn: api.listApplications })

export const useApplication = (id) =>
  useQuery({ queryKey: keys.application(id), queryFn: () => api.getApplication(id), enabled: !!id })
