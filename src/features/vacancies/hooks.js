import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

export const useJobs = () => useQuery({ queryKey: keys.jobs, queryFn: api.listJobs })

// Open vacancies for visitors; the server exposes no internal fields here.
export const usePublicJobs = () => useQuery({ queryKey: keys.publicJobs, queryFn: api.listPublicJobs })

// One open vacancy for its public page. A closed or unknown id is a 404.
export const usePublicJob = (id) =>
  useQuery({ queryKey: keys.publicJob(id), queryFn: () => api.getPublicJob(id), enabled: !!id, retry: false })
