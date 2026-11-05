import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { keys } from '@/shared/api/queryKeys'
import { useAuth } from '@/features/auth/AuthContext'
import { useJobs } from '@/features/vacancies/hooks'
import { submitApplication } from '@/features/applications/api'
import { applicationSchema, currentYear } from './schema'
import { toFormData } from './toFormData'

// Scroll to and focus the first invalid field.
function focusFirstError(errors) {
  const firstKey = Object.keys(errors)[0]
  const element = firstKey && document.querySelector(`[name="${firstKey}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.focus({ preventScroll: true })
  }
}

// All state and behaviour of the application form; the components only render.
export function useApplicationForm({ onSuccess } = {}) {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const queryClient = useQueryClient()
  const [submittedData, setSubmittedData] = useState(null)
  const [serverError, setServerError] = useState(null)

  const mutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.applications }),
  })

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: '',
      fullName: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      address: '',
      qualifications: [{ qualification: '', institution: '', yearCompleted: currentYear }],
      experience: [],
      references: [{ refereeName: '', organisation: '', contact: '' }],
      cv: null,
    },
  })

  // Arrived from "Apply" on the landing page: preselect that vacancy once the list is loaded.
  const wantedJob = searchParams.get('job')
  const { setValue } = form
  useEffect(() => {
    if (wantedJob && jobs.some((j) => j.id === wantedJob)) setValue('jobId', wantedJob)
  }, [wantedJob, jobs, setValue])

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await mutation.mutateAsync(toFormData(data))
    } catch (err) {
      setServerError(err.message)
      return
    }
    setSubmittedData(data)
    onSuccess?.(data)
  }

  return {
    form,
    jobs,
    jobsLoading,
    serverError,
    submittedData,
    isSubmitting: mutation.isPending,
    submit: form.handleSubmit(onSubmit, focusFirstError),
  }
}
