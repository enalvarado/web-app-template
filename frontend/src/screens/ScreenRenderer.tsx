import { ActionTrigger, ScreenConfig } from '../types/config'
import { useLocale } from '../context/LocaleContext'
import { resolveLocalized } from '../lib/i18n'
import { fieldFlexBasis } from '../lib/fieldStyle'
import FieldRenderer from '../components/FieldRenderer'

interface Props {
  screen: ScreenConfig
  formId: string
  onAction?: (action: ActionTrigger) => void
}

export default function ScreenRenderer({ screen, formId, onAction }: Props) {
  const { locale } = useLocale()
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-morado mb-1">{resolveLocalized(screen.title, locale)}</h2>
      {screen.description && (
        <p className="text-gris/80 font-body mb-4">{resolveLocalized(screen.description, locale)}</p>
      )}
      <div className="flex flex-wrap gap-x-4">
        {screen.fields.map((field) => (
          <div key={field.name} style={{ flex: fieldFlexBasis(field.width), minWidth: 0 }}>
            <FieldRenderer field={field} formId={formId} onAction={onAction} />
          </div>
        ))}
      </div>
    </div>
  )
}
