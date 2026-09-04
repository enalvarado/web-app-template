import { ScreenConfig } from '../types/config'
import { useLocale } from '../context/LocaleContext'
import { resolveLocalized } from '../lib/i18n'
import FieldRenderer from '../components/FieldRenderer'

interface Props {
  screen: ScreenConfig
  formId: string
}

export default function ScreenRenderer({ screen, formId }: Props) {
  const { locale } = useLocale()
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-morado mb-1">{resolveLocalized(screen.title, locale)}</h2>
      {screen.description && (
        <p className="text-gris/80 font-body mb-4">{resolveLocalized(screen.description, locale)}</p>
      )}
      {screen.fields.map((field) => (
        <FieldRenderer key={field.name} field={field} formId={formId} />
      ))}
    </div>
  )
}
