import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: string | undefined
  onChange: (value: string) => void
}

export default function RadioField({ field, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {(field.options ?? []).map((opt) => (
        <label key={opt} className="flex items-center gap-2 font-body text-base">
          <input
            type="radio"
            name={field.name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="w-5 h-5 accent-morado"
          />
          {opt}
        </label>
      ))}
    </div>
  )
}
