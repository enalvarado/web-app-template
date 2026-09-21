import { copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const BUILDER_FILE = fileURLToPath(new URL('../design/mockups/form-builder.html', import.meta.url))
const FORMS_DIR = fileURLToPath(new URL('./src/forms/', import.meta.url))

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

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(message)
  }
}

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])
// Letters, digits, - and _, not starting with _ (those folders are the repo's own test forms).
// Also what keeps the id from ever being a path like ../x.
const FORM_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/
const MAX_BODY_BYTES = 2 * 1024 * 1024

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size <= MAX_BODY_BYTES) chunks.push(chunk) // keep draining past the cap so the reply can be sent
    })
    req.on('end', () => (size > MAX_BODY_BYTES ? reject(new HttpError(413, 'Form config is too large.')) : resolve(Buffer.concat(chunks).toString('utf8'))))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

// Dev-only: the Form Builder's "Save to app" button POSTs a form config here and this writes it to
// src/forms/<id>/config.json — the same file you'd otherwise create by hand from "Export JSON".
// An endpoint that writes files is guarded: same machine only, requests must come from the
// builder page itself (a random website open in your browser can't post to localhost), the id can't
// be a path, and an existing form is only replaced when the builder says so — its previous version
// is kept as config.previous.json. `apply: 'serve'` keeps all of this out of `vite build`.
function saveFormToApp(): Plugin {
  return {
    name: 'save-form-to-app',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__builder/save-form', async (req, res) => {
        try {
          if (req.method !== 'POST') throw new HttpError(405, 'Use POST.')
          if (!LOOPBACK.has(req.socket.remoteAddress ?? '')) throw new HttpError(403, 'Only available from the same computer.')
          const origin = req.headers.origin
          if (origin && origin !== `http://${req.headers.host}`) throw new HttpError(403, 'Cross-origin requests are not allowed.')
          const site = req.headers['sec-fetch-site']
          if (site && site !== 'same-origin') throw new HttpError(403, 'Cross-site requests are not allowed.')
          if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) throw new HttpError(415, 'Send application/json.')

          let payload: { config?: Record<string, unknown>; overwrite?: boolean }
          try {
            payload = JSON.parse(await readBody(req))
          } catch (err) {
            if (err instanceof HttpError) throw err
            throw new HttpError(400, 'That is not valid JSON.')
          }
          const config = payload.config
          if (!config || typeof config !== 'object') throw new HttpError(400, 'Missing form config.')
          const id = config.id
          if (typeof id !== 'string' || !FORM_ID.test(id)) {
            throw new HttpError(400, 'The form id may only use letters, numbers, - and _, and cannot start with _ (it comes from the app name).')
          }
          if (!config.title || typeof config.title !== 'object' || !Array.isArray(config.screens) || config.screens.length === 0) {
            throw new HttpError(400, 'That does not look like a form config (it needs a title and at least one screen).')
          }

          const dir = path.join(FORMS_DIR, id)
          if (path.dirname(dir) !== path.resolve(FORMS_DIR)) throw new HttpError(400, 'Invalid form id.')
          const target = path.join(dir, 'config.json')
          const exists = await stat(target).then(() => true, () => false)
          if (exists && !payload.overwrite) throw new HttpError(409, 'A form with this id already exists.', { exists: true, id })

          await mkdir(dir, { recursive: true })
          if (exists) await copyFile(target, path.join(dir, 'config.previous.json'))
          const tmp = `${target}.tmp`
          await writeFile(tmp, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
          await rename(tmp, target)
          sendJson(res, 200, { ok: true, id, path: `frontend/src/forms/${id}/config.json`, overwritten: exists })
        } catch (err) {
          if (err instanceof HttpError) sendJson(res, err.status, { ok: false, error: err.message, ...err.extra })
          else sendJson(res, 500, { ok: false, error: 'Could not write the file.' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveFormBuilder(), saveFormToApp()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
