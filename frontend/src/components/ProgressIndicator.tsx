interface Props {
  current: number
  total: number
}

export default function ProgressIndicator({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm font-body text-gris mb-1">
        <span>
          Step {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-beige">
        <div className="h-2 rounded-full bg-morado transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
