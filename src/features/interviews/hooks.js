import { useQuery } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import * as api from './api'

export const usePanelists = (enabled = true) =>
  useQuery({ queryKey: keys.panelists, queryFn: api.listPanelists, enabled })
