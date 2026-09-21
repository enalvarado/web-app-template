import { ResolvedFieldConfig } from '../../types/config'
import { fieldBackground, fieldFontSize, fieldTextColor } from '../../lib/fieldStyle'

interface Props {
  field: ResolvedFieldConfig
}

// Plain display text (e.g. a welcome message) — not an input, so there's no label, value or
// required flag. Line breaks the author typed are kept; textColor/fontSize/background style the
// text itself here (on input fields they style the label instead).
export default function TextBlockField({ field }: Props) {
  if (!field.content) return null
  const background = fieldBackground(field.background)
  return (
    <p
      className={`mb-6 font-body text-gris whitespace-pre-line ${background ? 'rounded-lg p-3' : ''}`}
      style={{
        textAlign: field.align ?? 'left',
        color: fieldTextColor(field.textColor),
        fontSize: fieldFontSize(field.fontSize),
        backgroundColor: background,
      }}
    >
      {field.content}
    </p>
  )
}
