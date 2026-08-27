import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type FormValues = Record<string, unknown>

interface FormContextValue {
  values: FormValues
  setValue: (name: string, value: unknown) => void
  setValues: (values: FormValues) => void
  reset: () => void
}

const FormContext = createContext<FormContextValue | null>(null)

function storageKey(formId: string) {
  return `form-state:${formId}`
}

export function FormProvider({ formId, children }: { formId: string; children: ReactNode }) {
  const [values, setValuesState] = useState<FormValues>(() => {
    const raw = sessionStorage.getItem(storageKey(formId))
    return raw ? JSON.parse(raw) : {}
  })

  useEffect(() => {
    sessionStorage.setItem(storageKey(formId), JSON.stringify(values))
  }, [formId, values])

  const value = useMemo<FormContextValue>(
    () => ({
      values,
      setValue: (name, val) => setValuesState((prev) => ({ ...prev, [name]: val })),
      setValues: (v) => setValuesState((prev) => ({ ...prev, ...v })),
      reset: () => {
        sessionStorage.removeItem(storageKey(formId))
        setValuesState({})
      },
    }),
    [values, formId],
  )

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export function useFormValues() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormValues must be used within FormProvider')
  return ctx
}
