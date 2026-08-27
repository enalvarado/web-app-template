import { FormConfig } from '../types/config'
import { useFormValues } from '../context/FormContext'

interface Props {
  config: FormConfig
}

export default function ReviewScreen({ config }: Props) {
  const { values } = useFormValues()
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-morado mb-4">Review your answers</h2>
      {config.screens.map((screen) => (
        <div key={screen.id} className="mb-6">
          <h3 className="font-heading font-semibold text-gris mb-2">{screen.title}</h3>
          <dl className="divide-y divide-beige">
            {screen.fields.map((field) => (
              <div key={field.name} className="flex justify-between py-2 font-body">
                <dt className="text-gris/70">{field.label}</dt>
                <dd className="text-gris text-right max-w-[60%] break-words">{formatValue(values[field.name])}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'string' && value.startsWith('data:image')) return '[image attached]'
  return String(value)
}
