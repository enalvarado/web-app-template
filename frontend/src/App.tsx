import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FormConfig } from './types/config'
import { loadFormConfig } from './lib/loadConfig'
import FormApp from './screens/FormApp'

export default function App() {
  const { formId } = useParams<{ formId: string }>()
  const [config, setConfig] = useState<FormConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!formId) return
    loadFormConfig(formId)
      .then(setConfig)
      .catch(() => setError(`No form found for "${formId}".`))
  }, [formId])

  if (error) {
    return <div className="p-8 text-center text-rosado-deep font-heading">{error}</div>
  }
  if (!config) {
    return <div className="p-8 text-center text-gris">Loading…</div>
  }
  return <FormApp config={config} />
}
