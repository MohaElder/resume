<script>
  import Editable from './Editable.svelte'
  // `entry` is a reactive $state proxy from App — mutating its fields persists & saves.
  // All fields are Markdown (links via [text](url), plus **bold** / *italic* / `code`).
  let { entry, editing = false } = $props()
</script>

<div class="entry">
  <Editable tag="span" class="org" {editing} value={entry.org} onchange={(v) => (entry.org = v)} />

  <div class="role">
    <Editable {editing} value={entry.role} onchange={(v) => (entry.role = v)} />
    <span class="sep">|</span>
    <Editable {editing} value={entry.period} onchange={(v) => (entry.period = v)} />
  </div>

  <Editable
    tag="p"
    class="desc"
    {editing}
    value={entry.description}
    onchange={(v) => (entry.description = v)}
  />
</div>

<style>
  .entry {
    break-inside: avoid;
    margin-bottom: 4mm;
  }
  /* :global() because .org / .desc are rendered by the <Editable> child component. */
  .entry :global(.org) {
    display: block;
    font-weight: 700;
    font-size: 10pt;
    line-height: 1.2;
    color: #000;
  }
  .role {
    font-size: 10pt;
    color: #000;
    margin-top: 1.6mm;
  }
  .sep {
    margin: 0 0.15em;
  }
  .entry :global(.desc) {
    font-size: 9.3pt;
    line-height: 1.3;
    color: #333;
    margin: 1.6mm 0 0;
    text-align: justify;
    /* Hyphenate so justification has enough break points and stops stretching
       words apart; tighten tracking slightly to match the PDF's density. */
    hyphens: auto;
    -webkit-hyphens: auto;
    letter-spacing: -0.01em;
    word-spacing: -0.02em;
  }
</style>
