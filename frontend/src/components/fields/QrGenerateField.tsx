import { useEffect, useState } from 'react'
import { generateQr } from '../../lib/api'
import { useLocale } from '../../context/LocaleContext'
import { uiText } from '../../lib/i18n'

interface Props {
  value: string | undefined
}

export default function QrGenerateField({ value }: Props) {
  const { locale } = useLocale()
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    setImage(null)
    if (!value) return
    let cancelled = false
    generateQr(value)
      .then((img) => {
        if (!cancelled) setImage(img)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [value])

  if (!value) return <p className="text-sm text-gris/60 font-body">{uiText(locale, 'qrNothingToEncode')}</p>
  if (!image) return <p className="text-sm text-gris/60 font-body">{uiText(locale, 'qrGenerating')}</p>

  return <img src={image} alt="" className="w-40 h-40 rounded-lg border border-beige" />
}
