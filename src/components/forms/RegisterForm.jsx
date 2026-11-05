import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { register as registerAccount } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'

// Mirrors the server rules in backend/src/modules/accounts/account.schema.ts.
const schema = z
  .object({
    name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Za-z]/, 'Password needs a letter')
      .regex(/\d/, 'Password needs a number'),
    confirm: z.string().min(1, 'Confirm your password'),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' })

export default function RegisterForm() {
  const [bannerError, setBannerError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '', confirm: '' } })

  const mutation = useMutation({ mutationFn: registerAccount })

  const onSubmit = async ({ name, email, password }) => {
    setBannerError(null)
    try {
      await mutation.mutateAsync({ name, email, password })
    } catch (err) {
      setBannerError(err.message)
      return
    }
    const result = await login(email, password)
    if (result.success) navigate('/candidate')
    else navigate('/login')
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex justify-center mb-6">
        <img src="/logo.jpeg" alt="ERS Logo" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
      </div>
      <h1 className="text-2xl font-bold text-ers-ink mb-1 text-center">Create your account</h1>
      <p className="text-sm text-ers-ink-soft mb-6 text-center">Register to apply for vacancies and track your application</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input label="Full name" required error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="you@example.com" required error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" required hint="At least 8 characters, with a letter and a number" error={errors.password?.message} {...register('password')} />
        <Input label="Confirm password" type="password" required error={errors.confirm?.message} {...register('confirm')} />

        {bannerError && (
          <div className="flex items-center gap-2 bg-ers-danger/10 text-ers-danger text-sm px-4 py-3 rounded-lg" role="alert">
            <AlertCircle size={16} />
            <span>{bannerError}</span>
          </div>
        )}

        <Button type="submit" isLoading={mutation.isPending} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-sm text-ers-ink-soft text-center mt-6">
        Already registered?{' '}
        <Link to="/login" className="text-ers-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
