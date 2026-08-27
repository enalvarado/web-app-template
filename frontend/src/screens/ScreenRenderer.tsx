import { ScreenConfig } from '../types/config'
import FieldRenderer from '../components/FieldRenderer'

interface Props {
  screen: ScreenConfig
  formId: string
}

export default function ScreenRenderer({ screen, formId }: Props) {
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-morado mb-1">{screen.title}</h2>
      {screen.description && <p className="text-gris/80 font-body mb-4">{screen.description}</p>}
      {screen.fields.map((field) => (
        <FieldRenderer key={field.name} field={field} formId={formId} />
      ))}
    </div>
  )
}
