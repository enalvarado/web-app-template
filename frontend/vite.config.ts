import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const BUILDER_FILE = fileURLToPath(new URL('../design/mockups/form-builder.html', import.meta.url))

// Dev-only: serves the Form Builder mockup at /builder.html straight from design/mockups, so it
// runs on the same origin as the app (drafts in localStorage are per-origin) with no second copy
// to keep in sync. `apply: 'serve'` keeps it out of `vite build`.
function serveFormBuilder(): Plugin {
  return {
    name: 'serve-form-builder',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/builder.html', async (_req, res) => {
        try {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(await readFile(BUILDER_FILE))
        } catch {
          res.statusCode = 404
          res.end('design/mockups/form-builder.html not found')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveFormBuilder()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
