import Input from '@/shared/ui/Input'
import TextArea from '@/shared/ui/TextArea'
import FormSection from '../FormSection'

export default function PersonalSection({ register, errors }) {
  return (
    <FormSection title="Personal Information">
      <div className="space-y-4">
        <Input label="Full Name" placeholder="Aine Mary" required error={errors.fullName?.message} {...register('fullName')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            readOnly
            hint="Your account email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input label="Phone Number" type="tel" placeholder="+256 700 123456" required error={errors.phone?.message} {...register('phone')} />
        </div>
        <TextArea label="Address" rows={3} placeholder="Street, City, Postal Code" required error={errors.address?.message} {...register('address')} />
      </div>
    </FormSection>
  )
}
