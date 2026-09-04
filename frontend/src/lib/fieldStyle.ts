// Mirrors the swatch keys the Form Builder mockup (design/mockups/form-builder.html) writes
// into a field's `background`/`textColor`/`fontSize` — the builder stores the swatch *key*
// (e.g. "beige"), not a resolved CSS value, so the real app needs the same key -> value map.

const BACKGROUND_COLORS: Record<string, string> = {
  white: '#FFFFFF',
  beige: '#D8D2C4',
  azul: '#C2DFEA',
  rosado: '#F4C7CE',
  morado: 'rgba(84, 83, 134, .16)',
}

const TEXT_COLORS: Record<string, string> = {
  black: '#000000',
  gray: '#6b7280',
  red: '#dc2626',
  blue: '#2563eb',
}

const FONT_SIZES: Record<string, string> = {
  small: '11px',
  large: '17px',
}

// Same palette as BACKGROUND_COLORS, but at 80% transparency (.2 alpha) — a screen-wide wash
// needs to stay a subtle tint rather than a solid color block, unlike a single field's card.
const SCREEN_TINT_COLORS: Record<string, string> = {
  white: 'rgba(255, 255, 255, .2)',
  beige: 'rgba(216, 210, 196, .2)',
  azul: 'rgba(194, 223, 234, .2)',
  rosado: 'rgba(244, 199, 206, .2)',
  morado: 'rgba(84, 83, 134, .2)',
}

export function fieldBackground(key?: string): string | undefined {
  return key ? BACKGROUND_COLORS[key] : undefined
}

export function screenBackgroundTint(key?: string): string | undefined {
  return key ? SCREEN_TINT_COLORS[key] : undefined
}

export function fieldTextColor(key?: string): string | undefined {
  return key ? TEXT_COLORS[key] : undefined
}

export function fieldFontSize(key?: string): string | undefined {
  return key ? FONT_SIZES[key] : undefined
}

// A field with `width` < 100 sits side by side with the next field(s) on the same row —
// otherwise it takes the full row. Used as the flex-basis of each field's wrapper.
export function fieldFlexBasis(width?: number): string {
  return width && width < 100 && width > 0 ? `1 1 calc(${width}% - 8px)` : '1 1 100%'
}
