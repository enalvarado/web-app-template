import { Link } from 'react-router-dom'
import { FormConfig } from './types/config'
import { useLocale } from './context/LocaleContext'
import { resolveLocalized, uiText } from './lib/i18n'
import LanguageToggle from './components/LanguageToggle'

const configModules = import.meta.glob<{ default: FormConfig }>('./forms/*/config.json', { eager: true })

export default function Home() {
  const { locale } = useLocale()
  const forms = Object.values(configModules).map((m) => m.default)
  return (
    <div className="max-w-lg mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-semibold text-morado">{uiText(locale, 'availableForms')}</h1>
        <div className="bg-morado rounded-full">
          <LanguageToggle />
        </div>
      </div>
      <ul className="space-y-3">
        {forms.map((f) => (
          <li key={f.id}>
            <Link to={`/f/${f.id}`} className="text-morado underline font-body">
              {resolveLocalized(f.title, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
