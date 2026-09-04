import { useLocale } from '../context/LocaleContext'
import { Locale } from '../types/config'

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  const chip = (l: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(l)}
      className={
        'px-2.5 py-1 rounded-full font-heading text-[11px] font-bold tracking-wide' +
        (locale === l ? ' bg-white text-morado' : ' text-white/80')
      }
    >
      {label}
    </button>
  )

  return (
    <div className="flex gap-0.5 bg-white/15 rounded-full p-0.5">
      {chip('es', 'ES')}
      {chip('en', 'EN')}
    </div>
  )
}
