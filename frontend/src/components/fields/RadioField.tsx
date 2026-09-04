import { useEffect, useState } from 'react'
import { ResolvedFieldConfig } from '../../types/config'
import { useLocale } from '../../context/LocaleContext'
import { uiText } from '../../lib/i18n'
import { fetchDropdownOptions } from '../../lib/api'

interface Props {
  field: ResolvedFieldConfig
  formId: string
  value: string | undefined
  onChange: (value: string) => void
}

export default function RadioField({ field, formId, value, onChange }: Props) {
  const { locale } = useLocale()
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

  if (loading) {
    return <p className="text-sm text-gris/70 font-body">{uiText(locale, 'loading')}</p>
  }

  return (
    <div className={field.layout === 'horizontal' ? 'flex flex-wrap gap-x-6 gap-y-2' : 'flex flex-col gap-2'}>
      {options.map((opt) => (
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
