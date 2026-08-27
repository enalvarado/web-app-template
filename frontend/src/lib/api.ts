const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
const API_KEY = import.meta.env.VITE_API_KEY ?? ''

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
}

export async function submitForm(formId: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/forms/${formId}/submissions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`)
  return res.json()
}

export async function fetchDropdownOptions(formId: string, fieldName: string, query?: string) {
  const params = query ? `?query=${encodeURIComponent(query)}` : ''
  const res = await fetch(`${API_BASE}/forms/${formId}/dropdowns/${fieldName}${params}`, { headers })
  if (!res.ok) throw new Error(`Dropdown fetch failed: ${res.status}`)
  return res.json() as Promise<{ options: string[] }>
}

export async function qrLookup(formId: string, fieldName: string, code: string) {
  const res = await fetch(
    `${API_BASE}/forms/${formId}/qr-lookup/${fieldName}?code=${encodeURIComponent(code)}`,
    { headers },
  )
  if (!res.ok) throw new Error(`QR lookup failed: ${res.status}`)
  return res.json() as Promise<Record<string, unknown>>
}
