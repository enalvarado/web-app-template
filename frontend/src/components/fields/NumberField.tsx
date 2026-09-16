import { useState } from 'react'
import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
  value: number | undefined
  onChange: (value: number) => void
}

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base'

export default function NumberField({ field, value, onChange }: Props) {
  const format = field.numberFormat || 'integer'
  const [focused, setFocused] = useState(false)

  if (format === 'comma') {
    const isEmpty = value === undefined || Number.isNaN(value)
    const display = isEmpty ? '' : !focused ? value.toLocaleString('en-US') : value
    return (
      <input
        type="text"
        inputMode="decimal"
        value={display}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={field.required}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.-]/g, '')
          onChange(raw === '' ? NaN : Number(raw))
        }}
        className={INPUT_CLASS}
      />
    )
  }

  if (format === 'percentage') {
    return (
      <div className="relative">
        <input
          type="number"
          step="1"
          min={field.min ?? 0}
          max={field.max ?? 100}
          value={value ?? ''}
          required={field.required}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className={INPUT_CLASS + ' pr-9'}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gris/60 font-body">%</span>
      </div>
    )
  }

  return (
    <input
      type="number"
      step={format === 'decimal' ? 'any' : '1'}
      value={value ?? ''}
      min={field.min}
      max={field.max}
      required={field.required}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      className={INPUT_CLASS}
    />
  )
}
