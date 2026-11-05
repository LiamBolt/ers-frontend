import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import Button from '@/shared/ui/Button'
import { ROLE_LABELS } from '@/shared/constants/roles'

const STAFF_ROLES = ['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']

// Mirrors the server rules in backend/src/modules/users/user.schema.ts.
const schema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(STAFF_ROLES, { errorMap: () => ({ message: 'Select a role' }) }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password needs a letter')
    .regex(/\d/, 'Password needs a number'),
})

export default function CreateUserForm({ onSubmit, isLoading }) {
  const [serverError, setServerError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', role: '', password: '' } })

  const submit = async (data) => {
    setServerError(null)
    try {
      await onSubmit(data)
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <Input label="Full name" autoComplete="off" required error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" autoComplete="off" spellCheck={false} required error={errors.email?.message} {...register('email')} />
      <Select label="Role" required error={errors.role?.message} {...register('role')}>
        <option value="" disabled>Select a role</option>
        {STAFF_ROLES.map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </Select>
      <Input
        label="Temporary password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters with a letter and a number. Share it with the user securely."
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && (
        <div className="flex items-center gap-2 bg-ers-danger/10 text-ers-danger text-sm px-4 py-3 rounded-lg" role="alert">
          <AlertCircle size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <Button type="submit" isLoading={isLoading}>Create account</Button>
    </form>
  )
}
