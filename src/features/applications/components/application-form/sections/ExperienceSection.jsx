import { useFieldArray } from 'react-hook-form'
import Input from '@/shared/ui/Input'
import TextArea from '@/shared/ui/TextArea'
import FormSection from '../FormSection'
import { AddItemButton, RepeatedItem } from '../RepeatedItem'

export default function ExperienceSection({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' })

  return (
    <FormSection title="Experience">
      {fields.length === 0 && <p className="mb-2 text-sm text-ers-ink-soft">No experience added — this is optional</p>}
      {fields.map((field, index) => (
        <RepeatedItem key={field.id} onRemove={() => remove(index)} removeLabel="Remove experience">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Years of Experience"
              type="number"
              min="0"
              required
              error={errors.experience?.[index]?.yearsOfExperience?.message}
              {...register(`experience.${index}.yearsOfExperience`, { valueAsNumber: true })}
            />
            <Input
              label="Previous Employer"
              placeholder="Company name"
              required
              error={errors.experience?.[index]?.previousEmployer?.message}
              {...register(`experience.${index}.previousEmployer`)}
            />
            <Input
              label="Position Held"
              placeholder="Job title"
              required
              error={errors.experience?.[index]?.positionHeld?.message}
              {...register(`experience.${index}.positionHeld`)}
            />
          </div>
          <div className="mt-3">
            <TextArea
              label="Description"
              rows={3}
              placeholder="Brief description of responsibilities"
              hint={`${field.description?.length || 0}/500`}
              error={errors.experience?.[index]?.description?.message}
              {...register(`experience.${index}.description`)}
            />
          </div>
        </RepeatedItem>
      ))}
      <AddItemButton onClick={() => append({ yearsOfExperience: 0, previousEmployer: '', positionHeld: '', description: '' })}>
        Add another role
      </AddItemButton>
    </FormSection>
  )
}
