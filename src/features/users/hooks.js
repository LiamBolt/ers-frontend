import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

// Admin only: the server refuses this list for every other role.
export const useUsers = () => useQuery({ queryKey: keys.users, queryFn: api.listUsers })
