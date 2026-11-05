import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/shared/ui/Input'
import TextArea from '@/shared/ui/TextArea'
import Button from '@/shared/ui/Button'
import { SCORE_FIELDS } from '@/shared/constants/evaluation'

const score = z
  .number({ invalid_type_error: 'Enter a score' })
  .int('Whole numbers only')
  .min(0, 'Min 0')
  .max(100, 'Max 100')

const schema = z.object({
  technical: score,
  communication: score,
  problemSolving: score,
  teamwork: score,
  comments: z.string().min(10, 'Add a short justification (min 10 characters)'),
})

// Appendix A.2: four 0–100 scores plus comments.
export default function EvaluationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { comments: '' } })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        {SCORE_FIELDS.map((f) => (
          <Input
            key={f.key}
            label={`${f.label} (0–100)`}
            type="number"
            min="0"
            max="100"
            required
            error={errors[f.key]?.message}
            {...register(f.key, { valueAsNumber: true })}
          />
        ))}
      </div>
      <TextArea label="Comments" required rows={3} error={errors.comments?.message} {...register('comments')} />
      <Button type="submit">Submit evaluation</Button>
    </form>
  )
}
