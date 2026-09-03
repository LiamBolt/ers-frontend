import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
})

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [bannerError, setBannerError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    
    const result = login(data.email)
    
    if (result.success) {
      if (result.user.role === 'HR_OFFICER') {
        navigate('/vacancy')
      } else if (result.user.role === 'CANDIDATE') {
        navigate('/candidate')
      } else {
        navigate('/')
      }
    } else {
      setBannerError(result.error)
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8">
      <div className="flex justify-center mb-6">
        <img src="/logo.jpeg" alt="ERS Logo" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
      </div>
      <h1 className="text-2xl font-bold text-ers-ink mb-1 text-center">Sign in to ERS</h1>
      <p className="text-sm text-ers-ink-soft mb-6 text-center">Enter your email and password</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          error={errors.password?.message}
          endNode={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ers-ink-soft hover:text-ers-ink p-1 focus:outline-none focus:text-ers-primary"
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
    </div>
  )
}