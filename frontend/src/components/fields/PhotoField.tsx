import { useState } from 'react'

interface Props {
  value: string | undefined
  onChange: (value: string) => void
}

export default function PhotoField({ value, onChange }: Props) {
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="block w-full text-sm font-body"
      />
      {preview && <img src={preview} alt="Captured" className="mt-2 max-h-48 rounded-lg border border-beige" />}
    </div>
  )
}
