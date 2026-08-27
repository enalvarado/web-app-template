import { useEffect, useState } from 'react'
import { FieldConfig } from '../../types/config'
import { fetchDropdownOptions } from '../../lib/api'

interface Props {
  field: FieldConfig
  formId: string
  value: string | undefined
  onChange: (value: string) => void
}

export default function SelectField({ field, formId, value, onChange }: Props) {
  const [options, setOptions] = useState<string[]>(field.options ?? [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (field.source && field.source.kind !== 'static') {
      setLoading(true)
      fetchDropdownOptions(formId, field.name, field.source.query)
        .then((res) => setOptions(res.options))
        .finally(() => setLoading(false))
    }
  }, [field, formId])

  return (
    <select
      value={value ?? ''}
      required={field.required}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
      className="w-full px-4 py-3 rounded-lg border border-beige focus:outline-none focus:ring-2 focus:ring-morado font-body text-base bg-white"
    >
      <option value="" disabled>
        {loading ? 'Loading…' : (field.placeholder ?? 'Select…')}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
