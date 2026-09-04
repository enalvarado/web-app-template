import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: number | undefined
  onChange: (value: number) => void
}

export default function NumberField({ field, value, onChange }: Props) {
  return (
    <input
      type="number"
      value={value ?? ''}
      min={field.min}
      max={field.max}
      required={field.required}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      className="w-full px-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base"
    />
  )
}
