import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/features/auth/AuthContext'
import { Link, useSearchParams } from 'react-router-dom'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import Logo from '@/shared/brand/Logo'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
})

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [bannerError, setBannerError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const [params] = useSearchParams()
  const job = params.get('job') // set when the visitor clicked Apply on a vacancy
  const withJob = (path) => (job ? `${path}?job=${encodeURIComponent(job)}` : path)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setBannerError(null)
    const result = await login(data.email, data.password)
    setIsLoading(false)

    if (!result.success) {
      setBannerError(result.error)
      return
    }
    // On success the session exists and RedirectIfAuthenticated moves the user on.
  }

  return (
    <div className="surface-panel p-6 sm:p-8">
      <div className="mb-6 flex justify-center">
        <Logo variant="full" className="h-24" />
      </div>
      <h1 className="text-2xl font-bold text-ers-ink mb-1 text-center">Sign in to ERS</h1>
      <p className="text-sm text-ers-ink-soft mb-6 text-center">Enter your email and password</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          spellCheck={false}
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          endNode={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ers-ink-soft transition-colors hover:text-ers-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register('password')}
        />

        <div className="flex justify-end">
          <a href="#" className="text-sm text-ers-primary hover:underline">
            Forgot password?
          </a>
        </div>

        {bannerError && (
          <div
            className="flex items-center gap-2 bg-ers-danger/10 text-ers-danger text-sm px-4 py-3 rounded-lg"
            aria-live="polite"
            role="alert"
          >
            <AlertCircle size={16} />
            <span>{bannerError}</span>
          </div>
        )}

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="text-sm text-ers-ink-soft text-center mt-6">
        New candidate?{' '}
        <Link to={withJob('/register')} className="text-ers-primary font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}