import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface Props {
  value: string | undefined
  onChange: (value: string) => void
}

export default function SignatureField({ value, onChange }: Props) {
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
      <div className="border border-beige rounded-lg bg-white touch-none">
        <SignatureCanvas
          ref={padRef}
          penColor="#383A35"
          canvasProps={{ className: 'w-full h-40' }}
          onEnd={handleEnd}
        />
      </div>
      <button type="button" onClick={handleClear} className="mt-2 text-sm text-morado font-body underline">
        Clear
      </button>
      {!value && <p className="text-xs text-rosado-deep mt-1">Signature required</p>}
    </div>
  )
}
