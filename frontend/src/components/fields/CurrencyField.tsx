import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: number | undefined
  onChange: (value: number) => void
}

export default function CurrencyField({ field, value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/60 font-body">$</span>
      <input
        type="number"
        step="0.01"
        min={field.min}
        max={field.max}
        value={value ?? ''}
        required={field.required}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="w-full pl-8 pr-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base"
      />
    </div>
  )
}
