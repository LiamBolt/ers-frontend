import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { CONTRACT_TYPES } from '../../data/recruitment'

const schema = z.object({
  salary: z.number({ invalid_type_error: 'Enter a monthly salary' }).positive('Must be greater than 0'),
  startDate: z.string().refine((v) => v && new Date(v) > new Date(), 'Start date must be in the future'),
  contract: z.enum(CONTRACT_TYPES, { errorMap: () => ({ message: 'Select a contract type' }) }),
})

export default function OfferForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { startDate: '', contract: '' } })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Monthly salary (UGX)" type="number" required error={errors.salary?.message} {...register('salary', { valueAsNumber: true })} />
        <Input label="Start date" type="date" required error={errors.startDate?.message} {...register('startDate')} />
        <Select label="Contract" required error={errors.contract?.message} {...register('contract')}>
          <option value="" disabled>Select</option>
          {CONTRACT_TYPES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <Button type="submit">Generate &amp; send offer</Button>
    </form>
  )
}
