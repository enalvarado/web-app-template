export type Locale = 'en' | 'es'

export interface LocalizedString {
  en: string
  es: string
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'signature'
  | 'rating'
  | 'photo'
  | 'qrscan'

export interface DropdownSource {
  kind: 'static' | 'sql' | 'excel' | 'sharepoint'
  options?: string[]
  query?: string
  workbookId?: string
  sheet?: string
  siteId?: string
  listId?: string
}

export interface FieldConfig {
  name: string
  label: LocalizedString
  type: FieldType
  required?: boolean
  placeholder?: LocalizedString
  helpText?: LocalizedString
  options?: LocalizedString[]
  source?: DropdownSource
  min?: number
  max?: number
  autoFillTargets?: string[]
  lookupEndpoint?: string
}

// Same shape as FieldConfig, but with every LocalizedString resolved to a plain string
// for the active locale — what the individual field input components render from.
export type ResolvedFieldConfig = Omit<FieldConfig, 'label' | 'placeholder' | 'helpText' | 'options'> & {
  label: string
  placeholder?: string
  helpText?: string
  options?: string[]
}

export type ActionKind = 'next' | 'back' | 'submit' | 'reset' | 'goto' | 'none'

export interface ActionConfig {
  id: string
  label: LocalizedString
  style?: 'primary' | 'outline'
  action: ActionKind
  targetScreenId?: string
  disabled?: boolean
}

export interface ScreenConfig {
  id: string
  title: LocalizedString
  description?: LocalizedString
  fields: FieldConfig[]
  actions?: ActionConfig[]
}

export interface FormConfig {
  id: string
  title: LocalizedString
  description?: LocalizedString
  includeReviewScreen?: boolean
  screens: ScreenConfig[]
}
