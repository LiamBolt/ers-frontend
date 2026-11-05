import { useFieldArray } from 'react-hook-form'
import Input from '@/shared/ui/Input'
import FormSection from '../FormSection'
import { AddItemButton, RepeatedItem } from '../RepeatedItem'
import { currentYear } from '../schema'

export default function QualificationsSection({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'qualifications' })

  return (
    <FormSection title="Qualifications">
      {fields.map((field, index) => (
        <RepeatedItem key={field.id} onRemove={index > 0 ? () => remove(index) : undefined} removeLabel="Remove qualification">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Qualification"
              placeholder="e.g. BSc Computer Science"
              required
              error={errors.qualifications?.[index]?.qualification?.message}
              {...register(`qualifications.${index}.qualification`)}
            />
            <Input
              label="Institution"
              placeholder="University name"
              required
              error={errors.qualifications?.[index]?.institution?.message}
              {...register(`qualifications.${index}.institution`)}
            />
            <Input
              label="Year Completed"
              type="number"
              min="1970"
              max={currentYear}
              required
              error={errors.qualifications?.[index]?.yearCompleted?.message}
              {...register(`qualifications.${index}.yearCompleted`, { valueAsNumber: true })}
            />
          </div>
        </RepeatedItem>
      ))}
      <AddItemButton onClick={() => append({ qualification: '', institution: '', yearCompleted: currentYear })}>
        Add another qualification
      </AddItemButton>
      {errors.qualifications?.root && <p className="mt-2 text-xs text-ers-danger">{errors.qualifications.root.message}</p>}
    </FormSection>
  )
}
