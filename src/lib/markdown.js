// Minimal, dependency-free inline Markdown → HTML.
// Supports: [text](url), **bold**, *italic*, `code`. Newlines are preserved by
// CSS (white-space: pre-wrap), so no <br> conversion is needed here.
// Everything is HTML-escaped first and URLs are sanitized, so rendering edited
// content with {@html} is safe from injection.

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Allow only safe URL shapes; block javascript:, data:, etc.
function safeUrl(raw) {
  const u = raw.trim()
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(u)) return u
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) return 'mailto:' + u // bare email
  if (/^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(u)) return 'https://' + u // bare domain
  return '#'
}

export function renderMarkdown(src) {
  if (src == null) return ''
  let s = escapeHtml(String(src))
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text, url) =>
      `<a href="${safeUrl(url)}" target="_blank" rel="noopener">${text}</a>`,
  )
  return s
}
