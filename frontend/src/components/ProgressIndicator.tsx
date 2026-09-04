import { useLocale } from '../context/LocaleContext'
import { uiTextf } from '../lib/i18n'

interface Props {
  current: number
  total: number
}

export default function ProgressIndicator({ current, total }: Props) {
  const { locale } = useLocale()
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm font-body text-gris mb-1">
        <span>{uiTextf(locale, 'stepOf', { n: current, total })}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-beige">
        <div className="h-2 rounded-full bg-morado transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
