import { ActionConfig } from '../types/config'

interface Props {
  actions: ActionConfig[]
  onAction: (action: ActionConfig) => void
}

export default function ScreenActions({ actions, onAction }: Props) {
  if (!actions.length) return null
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled || action.action === 'none'}
          onClick={() => onAction(action)}
          className={
            action.style === 'outline'
              ? 'px-4 py-2.5 rounded-lg font-heading font-semibold text-sm text-morado border border-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition'
              : 'px-4 py-2.5 rounded-lg font-heading font-semibold text-sm text-white bg-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition'
          }
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
