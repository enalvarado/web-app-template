import { FormConfig } from '../types/config'

const configModules = import.meta.glob<{ default: FormConfig }>('../forms/*/config.json')

export async function loadFormConfig(formId: string): Promise<FormConfig> {
  const path = `../forms/${formId}/config.json`
  const importer = configModules[path]
  if (!importer) {
    throw new Error(`Unknown form id: ${formId}`)
  }
  const mod = await importer()
  return mod.default
}
