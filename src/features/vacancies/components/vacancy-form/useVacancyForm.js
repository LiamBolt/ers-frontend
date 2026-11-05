import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import { createJob } from '@/features/vacancies/api'
import { vacancySchema } from './schema'

// Form state and submit logic for publishing a vacancy; the components only render.
export function useVacancyForm({ onSuccess } = {}) {
  const queryClient = useQueryClient()
  const [submittedData, setSubmittedData] = useState(null)
  const [serverError, setServerError] = useState(null)

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.jobs }),
  })

  const form = useForm({
    resolver: zodResolver(vacancySchema),
    defaultValues: { jobTitle: '', department: '', numberOfPositions: 1, requiredSkills: '', description: '', closingDate: '' },
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await mutation.mutateAsync({
        title: data.jobTitle,
        department: data.department,
        numPositions: data.numberOfPositions,
        requiredSkills: data.requiredSkills,
        description: data.description?.trim() || undefined,
        closingDate: data.closingDate,
      })
    } catch (err) {
      setServerError(err.message)
      return
    }
    setSubmittedData(data)
    onSuccess?.(data)
  }

  return {
    form,
    serverError,
    submittedData,
    isSubmitting: mutation.isPending,
    submit: form.handleSubmit(onSubmit),
    startAnother: () => setSubmittedData(null),
  }
}
