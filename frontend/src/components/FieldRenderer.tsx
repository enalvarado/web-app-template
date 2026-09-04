import { FieldConfig } from '../types/config'
import { useFormValues } from '../context/FormContext'
import { useLocale } from '../context/LocaleContext'
import { resolveField } from '../lib/i18n'
import { qrLookup } from '../lib/api'
import TextField from './fields/TextField'
import TextareaField from './fields/TextareaField'
import NumberField from './fields/NumberField'
import SelectField from './fields/SelectField'
import DateField from './fields/DateField'
import DateTimeField from './fields/DateTimeField'
import CheckboxField from './fields/CheckboxField'
import RadioField from './fields/RadioField'
import ToggleField from './fields/ToggleField'
import SignatureField from './fields/SignatureField'
import RatingField from './fields/RatingField'
import PhotoField from './fields/PhotoField'
import QrScanField from './fields/QrScanField'

interface Props {
  field: FieldConfig
  formId: string
}

export default function FieldRenderer({ field, formId }: Props) {
  const { values, setValue, setValues } = useFormValues()
  const { locale } = useLocale()
  const value = values[field.name]
  const resolved = resolveField(field, locale)

  const handleQrScanned = async (code: string) => {
    try {
      const result = await qrLookup(formId, field.name, code)
      setValues(result)
    } catch {
      // Lookup failures leave the scanned code in place for manual entry.
    }
  }

  const body = (() => {
    switch (resolved.type) {
      case 'text':
        return <TextField field={resolved} value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'textarea':
        return <TextareaField field={resolved} value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'number':
        return <NumberField field={resolved} value={value as number} onChange={(v) => setValue(field.name, v)} />
      case 'select':
        return (
          <SelectField
            field={resolved}
            formId={formId}
            value={value as string}
            onChange={(v) => setValue(field.name, v)}
          />
        )
      case 'date':
        return <DateField field={resolved} value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'datetime':
        return <DateTimeField field={resolved} value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'checkbox':
        return <CheckboxField field={resolved} value={value as boolean} onChange={(v) => setValue(field.name, v)} />
      case 'radio':
        return <RadioField field={resolved} value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'toggle':
        return <ToggleField value={value as boolean} onChange={(v) => setValue(field.name, v)} />
      case 'signature':
        return <SignatureField value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'rating':
        return <RatingField value={value as number} onChange={(v) => setValue(field.name, v)} />
      case 'photo':
        return <PhotoField value={value as string} onChange={(v) => setValue(field.name, v)} />
      case 'qrscan':
        return (
          <QrScanField
            field={resolved}
            value={value as string}
            onChange={(v) => setValue(field.name, v)}
            onScanned={handleQrScanned}
          />
        )
      default:
        return <p className="text-rosado-deep text-sm">Unsupported field type: {resolved.type}</p>
    }
  })()

  return (
    <div className="mb-6">
      <label className="block font-heading font-semibold text-gris mb-2">
        {resolved.label}
        {resolved.required && <span className="text-rosado-deep ml-1">*</span>}
      </label>
      {body}
      {resolved.helpText && <p className="text-sm text-gris/70 mt-1 font-body">{resolved.helpText}</p>}
    </div>
  )
}
