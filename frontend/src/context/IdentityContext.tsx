import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { fetchWhoAmI } from '../lib/api'

interface IdentityContextValue {
  identity: string
  isManual: boolean
  detected: string
  setManualIdentity: (value: string) => void
  clearManualIdentity: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

const STORAGE_KEY = 'app-identity-manual'

// Informational only — a record of who says they're using the app, for the developer's
// own reference. Never validated, never required, never blocks access to a form.
export function IdentityProvider({ children }: { children: ReactNode }) {
  const [manual, setManual] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))
  const [detected, setDetected] = useState('')

  useEffect(() => {
    fetchWhoAmI()
      .then((r) => setDetected(r.username))
      .catch(() => setDetected(''))
  }, [])

  const value = useMemo<IdentityContextValue>(
    () => ({
      identity: manual ?? detected,
      isManual: manual !== null,
      detected,
      setManualIdentity: (v) => {
        const trimmed = v.trim()
        if (!trimmed) return
        localStorage.setItem(STORAGE_KEY, trimmed)
        setManual(trimmed)
      },
      clearManualIdentity: () => {
        localStorage.removeItem(STORAGE_KEY)
        setManual(null)
      },
    }),
    [manual, detected],
  )

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>
}

export function useIdentity() {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error('useIdentity must be used within IdentityProvider')
  return ctx
}
