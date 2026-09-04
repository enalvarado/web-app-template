import { FieldConfig, Locale, LocalizedString, ResolvedFieldConfig } from '../types/config'

export function resolveLocalized(value: LocalizedString, locale: Locale): string
export function resolveLocalized(value: LocalizedString | undefined, locale: Locale): string | undefined
export function resolveLocalized(value: LocalizedString | undefined, locale: Locale): string | undefined {
  if (!value) return undefined
  return value[locale] || value.en
}

export function resolveField(field: FieldConfig, locale: Locale): ResolvedFieldConfig {
  return {
    ...field,
    label: resolveLocalized(field.label, locale),
    placeholder: resolveLocalized(field.placeholder, locale),
    helpText: resolveLocalized(field.helpText, locale),
    options: field.options?.map((opt) => resolveLocalized(opt, locale)),
    alt: resolveLocalized(field.alt, locale),
    content: resolveLocalized(field.content, locale),
  }
}

// Static UI chrome strings (nav buttons, review screen, confirmation messages, loading states)
// that aren't part of any form's config — the EN/ES toggle needs these translated too, not just
// the authored form content, for a published form to read as fully bilingual.
const UI_STRINGS = {
  en: {
    stepOf: 'Step {n} of {total}',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    submitting: 'Submitting…',
    reviewYourAnswers: 'Review your answers',
    thankYou: 'Thank you!',
    submissionReceived: 'Your submission was received.',
    submitError: 'Something went wrong submitting your form. Please try again.',
    loading: 'Loading…',
    selectPlaceholder: 'Select…',
    scanned: 'Scanned:',
    rescan: 'Rescan',
    scan: 'Scan',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    imageAttached: '[image attached]',
    clear: 'Clear',
    signatureRequired: 'Signature required',
    captured: 'Captured',
    star: 'star',
    stars: 'stars',
    noFormFound: 'No form found for "{formId}".',
    availableForms: 'Available Forms',
  },
  es: {
    stepOf: 'Paso {n} de {total}',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
    submitting: 'Enviando…',
    reviewYourAnswers: 'Revisa tus respuestas',
    thankYou: '¡Gracias!',
    submissionReceived: 'Tu envío fue recibido.',
    submitError: 'Algo salió mal al enviar el formulario. Inténtalo de nuevo.',
    loading: 'Cargando…',
    selectPlaceholder: 'Seleccionar…',
    scanned: 'Escaneado:',
    rescan: 'Volver a escanear',
    scan: 'Escanear',
    cancel: 'Cancelar',
    yes: 'Sí',
    no: 'No',
    imageAttached: '[imagen adjunta]',
    clear: 'Borrar',
    signatureRequired: 'Firma requerida',
    captured: 'Capturada',
    star: 'estrella',
    stars: 'estrellas',
    noFormFound: 'No se encontró ningún formulario para "{formId}".',
    availableForms: 'Formularios Disponibles',
  },
} satisfies Record<Locale, Record<string, string>>

export type UiStringKey = keyof typeof UI_STRINGS.en

export function uiText(locale: Locale, key: UiStringKey): string {
  return UI_STRINGS[locale][key]
}

export function uiTextf(locale: Locale, key: UiStringKey, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce((s, [k, v]) => s.split(`{${k}}`).join(String(v)), uiText(locale, key))
}
