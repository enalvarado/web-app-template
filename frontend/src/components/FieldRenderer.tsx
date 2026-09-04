import { ActionTrigger, FieldConfig } from '../types/config'
import { useFormValues } from '../context/FormContext'
import { useLocale } from '../context/LocaleContext'
import { resolveField } from '../lib/i18n'
import { fieldBackground, fieldTextColor, fieldFontSize } from '../lib/fieldStyle'
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
import ImageField from './fields/ImageField'
import AccordionField from './fields/AccordionField'
import InlineButtonField from './fields/InlineButtonField'

interface Props {
  field: FieldConfig
  formId: string
  onAction?: (action: ActionTrigger) => void
}

export default function FieldRenderer({ field, formId, onAction }: Props) {
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

  // Content-block types render their own layout entirely — no label/required/helpText chrome,
  // no disabled fieldset (accordion manages its own children's disabled state individually).
  if (resolved.type === 'image') return <ImageField field={resolved} />
  if (resolved.type === 'accordion') return <AccordionField field={field} formId={formId} onAction={onAction} />
  if (resolved.type === 'button') return <InlineButtonField field={resolved} onAction={onAction} />

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
        return (
          <RadioField
            field={resolved}
            formId={formId}
            value={value as string}
            onChange={(v) => setValue(field.name, v)}
          />
        )
      case 'toggle':
        return <ToggleField value={value as boolean} onChange={(v) => setValue(field.name, v)} />
      case 'signature':
        return <SignatureField value={value as string} onChange={(v) => setValue(field.name, v)} disabled={resolved.disabled} />
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
    <fieldset
      disabled={resolved.disabled}
      className="mx-0 mb-6 mt-0 border-0 p-0 min-w-0 disabled:opacity-50"
      style={{ backgroundColor: fieldBackground(field.background) }}
    >
      <label
        className={resolved.hideLabel ? 'sr-only' : 'block font-heading font-semibold text-gris mb-2'}
        style={{ color: fieldTextColor(field.textColor), fontSize: fieldFontSize(field.fontSize) }}
      >
        {resolved.label}
        {resolved.required && <span className="text-rosado-deep ml-1">*</span>}
      </label>
      {body}
      {resolved.helpText && <p className="text-sm text-gris/70 mt-1 font-body">{resolved.helpText}</p>}
    </fieldset>
  )
}
