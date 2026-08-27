interface Props {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backDisabled?: boolean
  nextDisabled?: boolean
}

export default function NavButtons({ onBack, onNext, nextLabel = 'Next', backDisabled, nextDisabled }: Props) {
  return (
    <div className="flex justify-between mt-8">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled}
        className="px-5 py-3 rounded-lg font-heading font-semibold text-morado border border-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
      >
        ◀ Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="px-5 py-3 rounded-lg font-heading font-semibold text-white bg-morado disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition"
      >
        {nextLabel} ▶
      </button>
    </div>
  )
}
