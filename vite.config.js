import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Absolute path to the repo-tracked "database" the editor writes back to.
const DATA_PATH = fileURLToPath(new URL('./src/data/resume.json', import.meta.url))

// Dev/preview-only endpoint: POST /api/resume → overwrites src/data/resume.json.
// This is what makes browser edits persist into the repo (commit the file to keep them).
// It is NOT part of the production build, so a statically-hosted copy is read-only.
function resumeSaveApi() {
  const handler = (req, res, next) => {
    if (req.method !== 'POST' || req.url !== '/api/resume') return next()
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', async () => {
      try {
        const data = JSON.parse(body)
        await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
        res.statusCode = 200
        res.setHeader('content-type', 'application/json')
        res.end('{"ok":true}')
      } catch (err) {
        res.statusCode = 400
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: String(err) }))
      }
    })
  }
  return {
    name: 'resume-save-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

// Build to relative paths so it can be hosted from any subpath (e.g. GitHub Pages project sites).
export default defineConfig({
  plugins: [svelte(), resumeSaveApi()],
  base: './',
})
