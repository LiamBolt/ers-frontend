import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/shared/ui/Input'
import Button from '@/shared/ui/Button'
import TextArea from '@/shared/ui/TextArea'
import { usePanelists } from '@/features/interviews/hooks'

const schema = z.object({
  date: z.string().min(1, 'Choose a date and time').refine((v) => new Date(v) > new Date(), 'Pick a time in the future'),
  location: z.string().min(3, 'Enter a location or meeting link'),
  panel: z.array(z.string()).min(1, 'Assign at least one panel member'),
  note: z.string().max(1000).optional(),
})

export default function ScheduleInterviewForm({ onSubmit, withNote = false, onCancel }) {
  const { data: panelists = [], isLoading } = usePanelists()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { date: '', location: '', panel: [], note: '' } })

  return (
    <form
      onSubmit={handleSubmit((d) => onSubmit({ ...d, date: new Date(d.date).toISOString() }))}
      className="space-y-4"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Date & time" type="datetime-local" required error={errors.date?.message} {...register('date')} />
        <Input label="Location" placeholder="Room or meeting link" required error={errors.location?.message} {...register('location')} />
      </div>
      <fieldset>
        <legend className="block text-sm font-semibold text-ers-ink mb-1.5">
          Panel members<span className="text-ers-danger ml-0.5">*</span>
        </legend>
        <div className="space-y-2">
          {isLoading && <p className="text-sm text-ers-ink-soft">Loading panel members…</p>}
          {!isLoading && panelists.length === 0 && (
            <p className="text-sm text-ers-ink-soft">No panel members are available yet.</p>
          )}
          <p className="text-xs text-ers-ink-soft">
            Administrators can sit on a panel. To add more panel members,{' '}
            <Link to="/users" className="font-semibold text-ers-primary underline">create accounts with the Interviewer role</Link>.
          </p>
          {panelists.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm text-ers-ink">
              <input type="checkbox" value={p.id} className="accent-[var(--ers-primary)]" {...register('panel')} />
              {p.name} <span className="text-ers-ink-soft text-xs">{p.email}</span>
            </label>
          ))}
        </div>
        {errors.panel && <p className="text-xs text-ers-danger mt-1">{errors.panel.message}</p>}
      </fieldset>
      {withNote && (
        <TextArea label="Note to the candidate (optional)" rows={2} hint="Shown in their notification, e.g. what to bring." {...register('note')} />
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Schedule interview</Button>
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
