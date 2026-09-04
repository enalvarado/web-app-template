import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: string | undefined
  onChange: (value: string) => void
}

export default function DateField({ field, value, onChange }: Props) {
  return (
    <input
      type="date"
      value={value ?? ''}
      required={field.required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base"
    />
  )
}
