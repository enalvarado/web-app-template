interface Props {
  value: boolean | undefined
  onChange: (value: boolean) => void
}

export default function ToggleField({ value, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value ?? false}
      onClick={() => onChange(!value)}
      className={`w-14 h-8 rounded-full transition-colors relative ${value ? 'bg-morado' : 'bg-beige'}`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : ''}`}
      />
    </button>
  )
}
