import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationAction } from './api'
import { keys } from '@/shared/api/queryKeys'

// One mutation backs every stage action. Each answers with the refreshed
// application, which is written straight into the cache; lists, reports and
// notifications are then invalidated so they refetch.
export function useApplicationActions(id) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ path, body }) => applicationAction(id, path, body),
    onSuccess: (application) => {
      queryClient.setQueryData(keys.application(id), application)
      queryClient.invalidateQueries({ queryKey: keys.applications, exact: true })
      queryClient.invalidateQueries({ queryKey: ['report'] })
      queryClient.invalidateQueries({ queryKey: keys.notifications })
    },
  })

  const run = (path, body) => mutation.mutateAsync({ path, body })

  return {
    isPending: mutation.isPending,
    startScreening: () => run('/transition', { to: 'UNDER_SCREENING' }),
    shortlist: (note = '') => run('/transition', { to: 'SHORTLISTED', note }),
    reject: (note) => run('/transition', { to: 'REJECTED', note }),
    select: (note = '') => run('/transition', { to: 'SELECTED', note }),
    scheduleInterview: (data) => run('/interview', data),
    completeInterview: () => run('/interview/complete'),
    submitEvaluation: (scores) => run('/evaluations', scores),
    decide: (decision, note = '') => run('/approval', { decision, note }),
    sendOffer: (offer) => run('/offer', offer),
    respondToOffer: (response, note = '') => run('/offer/response', { response, note }),
    verifyDocument: (name) => run('/onboarding/documents', { name }),
    confirmOnboarding: (key) => run('/onboarding/confirmations', { key }),
    completeOnboarding: () => run('/onboarding/complete'),
  }
}
