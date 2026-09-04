import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: string | undefined
  onChange: (value: string) => void
}

export default function TextareaField({ field, value, onChange }: Props) {
  return (
    <textarea
      value={value ?? ''}
      placeholder={field.placeholder}
      required={field.required}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base"
    />
  )
}
