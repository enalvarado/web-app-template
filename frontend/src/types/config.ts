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
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  helpText?: string
  options?: string[]
  source?: DropdownSource
  min?: number
  max?: number
  autoFillTargets?: string[]
  lookupEndpoint?: string
}

export interface ScreenConfig {
  id: string
  title: string
  description?: string
  fields: FieldConfig[]
}

export interface FormConfig {
  id: string
  title: string
  description?: string
  includeReviewScreen?: boolean
  screens: ScreenConfig[]
}
