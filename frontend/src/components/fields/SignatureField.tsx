import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useLocale } from '../../context/LocaleContext'
import { uiText } from '../../lib/i18n'

interface Props {
  value: string | undefined
  onChange: (value: string) => void
  disabled?: boolean
}

// The signature pad is a <canvas>, not a native form control, so it's the one field body that
// a wrapping <fieldset disabled> can't reach — it needs its own explicit disabled handling.
export default function SignatureField({ value, onChange, disabled }: Props) {
  const { locale } = useLocale()
  const padRef = useRef<SignatureCanvas>(null)

  const handleEnd = () => {
    const pad = padRef.current
    if (pad && !pad.isEmpty()) {
      onChange(pad.getTrimmedCanvas().toDataURL('image/png'))
    }
  }

  const handleClear = () => {
    padRef.current?.clear()
    onChange('')
  }

  return (
    <div>
      <div
        className={`border border-beige rounded-lg bg-white touch-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <SignatureCanvas
          ref={padRef}
          penColor="#383A35"
          canvasProps={{ className: 'w-full h-40' }}
          onEnd={handleEnd}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        disabled={disabled}
        className="mt-2 text-sm text-morado font-body underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uiText(locale, 'clear')}
      </button>
      {!value && <p className="text-xs text-rosado-deep mt-1">{uiText(locale, 'signatureRequired')}</p>}
    </div>
  )
}
