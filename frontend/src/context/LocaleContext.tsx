import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Locale } from '../types/config'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'app-locale'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'es' ? 'es' : 'en'
  })

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (l) => {
        localStorage.setItem(STORAGE_KEY, l)
        setLocaleState(l)
      },
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
