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
  | 'image'
  | 'accordion'
  | 'button'

// Only 'sql' is wired up end-to-end: the Form Builder's "query" is the name of a query a
// developer registered in backend/app/datasources/sql_source.py, not raw SQL — the backend
// only ever executes queries it already knows about. 'excel'/'sharepoint' are recognized by
// the schema for forward-compat but have no backend implementation and aren't offered by the
// Form Builder; a config that sets one will simply get no options at runtime.
export interface DropdownSource {
  kind: 'static' | 'sql' | 'excel' | 'sharepoint'
  options?: string[]
  query?: string
  workbookId?: string
  sheet?: string
  siteId?: string
  listId?: string
}

export type ActionKind = 'next' | 'back' | 'submit' | 'reset' | 'goto' | 'none'

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
  // Layout / presentation — set by the Form Builder's per-field styling controls.
  width?: number
  hideLabel?: boolean
  disabled?: boolean
  background?: string
  textColor?: string
  fontSize?: string
  // radio only
  layout?: 'horizontal' | 'vertical'
  // image only
  src?: string
  alt?: LocalizedString
  align?: 'left' | 'center' | 'right'
  // accordion only — one level of nesting, no accordion-in-accordion
  content?: LocalizedString
  defaultOpen?: boolean
  children?: FieldConfig[]
  // button only (a button embedded as a content-block field, e.g. inside an accordion —
  // distinct from a screen's top-level ActionConfig buttons, rendered by ScreenActions)
  action?: ActionKind
  targetScreenId?: string
  style?: 'primary' | 'outline'
}

// Same shape as FieldConfig, but with every LocalizedString resolved to a plain string
// for the active locale — what the individual field input components render from.
export type ResolvedFieldConfig = Omit<FieldConfig, 'label' | 'placeholder' | 'helpText' | 'options' | 'alt' | 'content'> & {
  label: string
  placeholder?: string
  helpText?: string
  options?: string[]
  alt?: string
  content?: string
}

export interface ActionConfig {
  id: string
  label: LocalizedString
  style?: 'primary' | 'outline'
  action: ActionKind
  targetScreenId?: string
  disabled?: boolean
}

// What a clicked button (top-level ScreenActions or a nested button field) actually needs to
// hand back to FormApp to drive navigation/submit — decoupled from ActionConfig's display
// fields (id/label/style) so field components deep in the tree don't need to fabricate them.
export type ActionTrigger = Pick<ActionConfig, 'action' | 'targetScreenId'>

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
  headerLogoUrl?: string
  headerLogoPosition?: 'left' | 'right'
  headerLogoSize?: number
  backgroundImageUrl?: string
  screens: ScreenConfig[]
}
