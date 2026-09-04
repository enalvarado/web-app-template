import { ActionTrigger, ResolvedFieldConfig } from '../../types/config'
import { fieldTextColor, fieldFontSize } from '../../lib/fieldStyle'

interface Props {
  field: ResolvedFieldConfig
  onAction?: (action: ActionTrigger) => void
}

// A button authored as a content-block field (currently only reachable nested inside an
// accordion) rather than a screen-level ActionConfig — same five actions, rendered inline
// wherever it sits among the accordion's other children instead of in the Back/Next row.
export default function InlineButtonField({ field, onAction }: Props) {
  const action = field.action ?? 'next'
  return (
    <button
      type="button"
      disabled={field.disabled || action === 'none'}
      onClick={() => onAction?.({ action, targetScreenId: field.targetScreenId })}
      style={{ color: fieldTextColor(field.textColor), fontSize: fieldFontSize(field.fontSize) }}
      className={
        field.style === 'outline'
          ? 'w-full mb-6 px-4 py-2.5 rounded-lg font-heading font-semibold text-sm text-morado border border-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition'
          : 'w-full mb-6 px-4 py-2.5 rounded-lg font-heading font-semibold text-sm text-white bg-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition'
      }
    >
      {field.label}
    </button>
  )
}
