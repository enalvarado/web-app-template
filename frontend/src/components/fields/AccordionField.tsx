import { useState } from 'react'
import { ActionTrigger, FieldConfig } from '../../types/config'
import { useLocale } from '../../context/LocaleContext'
import { resolveField } from '../../lib/i18n'
import { fieldBackground, fieldTextColor, fieldFontSize, fieldFlexBasis } from '../../lib/fieldStyle'
import FieldRenderer from '../FieldRenderer'

interface Props {
  field: FieldConfig
  formId: string
  onAction?: (action: ActionTrigger) => void
}

export default function AccordionField({ field, formId, onAction }: Props) {
  const { locale } = useLocale()
  const resolved = resolveField(field, locale)
  const [open, setOpen] = useState(!!field.defaultOpen)

  return (
    <div
      className="mb-6 border border-beige rounded-lg overflow-hidden bg-white"
      style={{ backgroundColor: fieldBackground(field.background) }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-beige/25 font-heading font-semibold text-gris text-left"
        style={{ color: fieldTextColor(field.textColor), fontSize: fieldFontSize(field.fontSize) }}
      >
        <span>{resolved.label}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="p-4 border-t border-beige">
          {resolved.content && <p className="text-sm text-gris/80 mb-3 whitespace-pre-wrap font-body">{resolved.content}</p>}
          <div className="flex flex-wrap gap-x-4">
            {(field.children ?? []).map((child) => (
              <div key={child.name} style={{ flex: fieldFlexBasis(child.width), minWidth: 0 }}>
                <FieldRenderer field={child} formId={formId} onAction={onAction} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
