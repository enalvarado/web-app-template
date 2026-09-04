import { useLocale } from '../../context/LocaleContext'
import { uiText } from '../../lib/i18n'

interface Props {
  value: number | undefined
  onChange: (value: number) => void
  max?: number
}

export default function RatingField({ value = 0, onChange, max = 5 }: Props) {
  const { locale } = useLocale()
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-3xl leading-none ${n <= value ? 'text-morado' : 'text-beige'}`}
          aria-label={`${n} ${uiText(locale, n > 1 ? 'stars' : 'star')}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
