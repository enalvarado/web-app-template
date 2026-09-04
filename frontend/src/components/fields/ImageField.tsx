import { ResolvedFieldConfig } from '../../types/config'

interface Props {
  field: ResolvedFieldConfig
}

export default function ImageField({ field }: Props) {
  if (!field.src) return null
  const justify = field.align === 'left' ? 'justify-start' : field.align === 'right' ? 'justify-end' : 'justify-center'
  return (
    <div className={`flex mb-6 ${justify}`}>
      <img src={field.src} alt={field.alt ?? ''} className="max-w-full max-h-40 rounded-lg" />
    </div>
  )
}
