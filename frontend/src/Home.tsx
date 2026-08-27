import { Link } from 'react-router-dom'
import { FormConfig } from './types/config'

const configModules = import.meta.glob<{ default: FormConfig }>('./forms/*/config.json', { eager: true })

export default function Home() {
  const forms = Object.values(configModules).map((m) => m.default)
  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-heading font-semibold text-morado mb-6">Available Forms</h1>
      <ul className="space-y-3">
        {forms.map((f) => (
          <li key={f.id}>
            <Link to={`/f/${f.id}`} className="text-morado underline font-body">
              {f.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
