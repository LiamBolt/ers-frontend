import { useFieldArray } from 'react-hook-form'
import Input from '@/shared/ui/Input'
import FormSection from '../FormSection'
import { AddItemButton, RepeatedItem } from '../RepeatedItem'

export default function ReferencesSection({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'references' })

  return (
    <FormSection title="References">
      {fields.map((field, index) => (
        <RepeatedItem key={field.id} onRemove={index > 0 ? () => remove(index) : undefined} removeLabel="Remove reference">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Referee Name"
              placeholder="Full name"
              required
              error={errors.references?.[index]?.refereeName?.message}
              {...register(`references.${index}.refereeName`)}
            />
            <Input
              label="Organisation"
              placeholder="Company / Institution"
              required
              error={errors.references?.[index]?.organisation?.message}
              {...register(`references.${index}.organisation`)}
            />
            <Input
              label="Phone or Email"
              placeholder="+256... or email"
              required
              error={errors.references?.[index]?.contact?.message}
              {...register(`references.${index}.contact`)}
            />
          </div>
        </RepeatedItem>
      ))}
      <AddItemButton onClick={() => append({ refereeName: '', organisation: '', contact: '' })}>Add another reference</AddItemButton>
      {errors.references?.root && <p className="mt-2 text-xs text-ers-danger">{errors.references.root.message}</p>}
    </FormSection>
  )
}
