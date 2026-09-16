import { useState } from 'react'
import { useIdentity } from '../context/IdentityContext'
import { useLocale } from '../context/LocaleContext'
import { uiText, uiTextf } from '../lib/i18n'

export default function IdentityChip() {
  const { identity, isManual, detected, setManualIdentity, clearManualIdentity } = useIdentity()
  const { locale } = useLocale()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (editing) {
    return (
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault()
          setManualIdentity(draft)
          setEditing(false)
        }}
      >
        <input
          type="email"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={uiText(locale, 'identityPlaceholder')}
          className="w-24 sm:w-36 px-2 py-1 rounded-full text-[11px] font-body text-gris bg-white"
        />
        <button
          type="submit"
          className="px-2 py-1 rounded-full bg-white text-morado font-heading text-[11px] font-bold whitespace-nowrap"
        >
          {uiText(locale, 'identitySave')}
        </button>
        {isManual && detected && (
          <button
            type="button"
            title={uiTextf(locale, 'identityUseDetected', { value: detected })}
            onClick={() => {
              clearManualIdentity()
              setEditing(false)
            }}
            className="text-white/70 text-[11px] underline whitespace-nowrap"
          >
            {detected}
          </button>
        )}
      </form>
    )
  }

  return (
    <button
      type="button"
      title={uiText(locale, 'identityEditTitle')}
      onClick={() => {
        setDraft(isManual ? identity : '')
        setEditing(true)
      }}
      className="max-w-[90px] sm:max-w-[160px] truncate px-2.5 py-1 rounded-full bg-white/15 text-white/80 font-heading text-[11px] font-bold tracking-wide"
    >
      {identity || '—'}
    </button>
  )
}
