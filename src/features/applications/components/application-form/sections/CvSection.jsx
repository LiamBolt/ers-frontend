import { Controller } from 'react-hook-form'
import FileUpload from '@/shared/ui/FileUpload'
import FormSection from '../FormSection'

export default function CvSection({ control, errors, clearErrors }) {
  return (
    <FormSection title="CV Upload">
      <Controller
        name="cv"
        control={control}
        render={({ field }) => (
          <FileUpload
            label="Curriculum Vitae"
            required
            value={field.value}
            onChange={(file) => {
              field.onChange(file)
              if (file) clearErrors('cv')
            }}
            error={errors.cv?.message}
          />
        )}
      />
    </FormSection>
  )
}
