import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: boolean | undefined
  onChange: (value: boolean) => void
}

export default function CheckboxField({ field, value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 font-body text-base">
      <input
        type="checkbox"
        checked={value ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-morado"
      />
      {field.placeholder || field.label}
    </label>
  )
}
