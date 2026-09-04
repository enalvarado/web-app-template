import { FormConfig, Locale } from '../types/config'
import { useFormValues } from '../context/FormContext'
import { useLocale } from '../context/LocaleContext'
import { resolveLocalized, uiText } from '../lib/i18n'

interface Props {
  config: FormConfig
}

export default function ReviewScreen({ config }: Props) {
  const { values } = useFormValues()
  const { locale } = useLocale()
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-morado mb-4">{uiText(locale, 'reviewYourAnswers')}</h2>
      {config.screens.map((screen) => {
        // Content-block fields (image/accordion) have no answer of their own to review —
        // matches the Form Builder's own review preview, which skips them the same way.
        const fields = screen.fields.filter((f) => f.type !== 'image' && f.type !== 'accordion' && f.type !== 'button')
        if (fields.length === 0) return null
        return (
          <div key={screen.id} className="mb-6">
            <h3 className="font-heading font-semibold text-gris mb-2">{resolveLocalized(screen.title, locale)}</h3>
            <dl className="divide-y divide-beige">
              {fields.map((field) => (
                <div key={field.name} className="flex justify-between py-2 font-body">
                  <dt className="text-gris/70">{resolveLocalized(field.label, locale)}</dt>
                  <dd className="text-gris text-right max-w-[60%] break-words">
                    {formatValue(values[field.name], locale)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )
      })}
    </div>
  )
}

function formatValue(value: unknown, locale: Locale): string {
  if (value === undefined || value === null || value === '') return '—'
  if (typeof value === 'boolean') return value ? uiText(locale, 'yes') : uiText(locale, 'no')
  if (typeof value === 'string' && value.startsWith('data:image')) return uiText(locale, 'imageAttached')
  return String(value)
}
