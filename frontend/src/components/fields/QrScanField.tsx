import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { ResolvedFieldConfig } from '../../types/config'
import { useLocale } from '../../context/LocaleContext'
import { uiText } from '../../lib/i18n'

interface Props {
  field: ResolvedFieldConfig
  value: string | undefined
  onChange: (value: string) => void
  onScanned?: (code: string) => void
}

const REGION_ID = 'qr-scan-region'

export default function QrScanField({ field, value, onChange, onScanned }: Props) {
  const { locale } = useLocale()
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  const startScan = async () => {
    setScanning(true)
    const scanner = new Html5Qrcode(REGION_ID)
    scannerRef.current = scanner
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onChange(decodedText)
          onScanned?.(decodedText)
          scanner.stop().then(() => setScanning(false))
        },
        undefined,
      )
    } catch {
      setScanning(false)
    }
  }

  const stopScan = () => {
    scannerRef.current?.stop().then(() => setScanning(false))
  }

  return (
    <div>
      {value && (
        <p className="mb-2 font-body text-sm text-gris">
          {uiText(locale, 'scanned')} {value}
        </p>
      )}
      {scanning ? (
        <div>
          <div id={REGION_ID} className="w-full max-w-sm rounded-lg overflow-hidden" />
          <button type="button" onClick={stopScan} className="mt-2 text-sm text-morado underline">
            {uiText(locale, 'cancel')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={startScan}
          className="px-4 py-2 rounded-lg bg-morado text-white font-heading font-semibold"
        >
          {value ? uiText(locale, 'rescan') : `${uiText(locale, 'scan')} ${field.label}`}
        </button>
      )}
    </div>
  )
}
