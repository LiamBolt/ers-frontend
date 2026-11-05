import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, updateUser } from '../api/users'
import { keys } from './queries'

// Create / update users (admin). The panel-member list used by the interview
// scheduler is derived from users, so it is refreshed too.
export function useUserMutations() {
  const queryClient = useQueryClient()
  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: keys.users })
    queryClient.invalidateQueries({ queryKey: keys.panelists })
  }

  const create = useMutation({ mutationFn: createUser, onSuccess })
  const update = useMutation({ mutationFn: ({ id, ...data }) => updateUser(id, data), onSuccess })

  return {
    createUser: create.mutateAsync,
    isCreating: create.isPending,
    updateUser: (id, data) => update.mutateAsync({ id, ...data }),
    isUpdating: update.isPending,
  }
}
