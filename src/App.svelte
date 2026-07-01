<script>
  import initialData from './data/resume.json'
  import Header from './components/Header.svelte'
  import Section from './components/Section.svelte'
  import LinksSection from './components/LinksSection.svelte'

  // Deep reactive copy of the repo "database". Any edit mutates this and is
  // persisted back to src/data/resume.json via the dev/preview API.
  let resume = $state(structuredClone(initialData))
  let editing = $state(false)
  let saveState = $state('idle') // 'idle' | 'saving' | 'saved' | 'error'

  let showPhoto = $state(Boolean(resume.profile.photo))

  let saveTimer
  let initialized = false
  $effect(() => {
    const json = JSON.stringify(resume) // deep-track every field
    if (!initialized) {
      initialized = true
      return
    }
    saveState = 'saving'
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => persist(json), 400)
  })

  async function persist(json) {
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: json,
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      saveState = 'saved'
    } catch {
      // No backend (e.g. statically hosted) — edits stay in-session only.
      saveState = 'error'
    }
  }

  const saveLabel = $derived(
    { idle: '', saving: 'Saving…', saved: 'Saved ✓', error: 'Not saved (no server)' }[saveState],
  )

  function downloadPdf() {
    const wasEditing = editing
    editing = false // ensure a clean, non-editable capture
    requestAnimationFrame(() => {
      window.print()
      editing = wasEditing
    })
  }
</script>

<div class="toolbar">
  {#if saveLabel}
    <span class="status" class:error={saveState === 'error'}>{saveLabel}</span>
  {/if}
  <button class="btn" class:active={editing} onclick={() => (editing = !editing)}>
    {editing ? 'Done' : 'Edit'}
  </button>
  <button class="btn" onclick={downloadPdf} title="Print / save as PDF">Print</button>
</div>

<main class="page" class:editing>
  <Header profile={resume.profile} {editing} />

  {#each resume.sections as section}
    {#if section.links}
      <LinksSection {section} {editing} />
    {:else}
      <Section {section} {editing} />
    {/if}
  {/each}

  {#if showPhoto}
    <img
      class="photo"
      src={resume.profile.photo}
      alt=""
      onerror={() => (showPhoto = false)}
    />
  {/if}
</main>

<style>
  .page {
    position: relative;
    box-sizing: border-box;
    width: 210mm;
    min-height: 297mm;
    margin: 8mm auto;
    /* Margins matched to the source PDF: top 9.5 / right 13.7 / bottom 16 / left 9.9 (mm). */
    padding: 9.5mm 13.7mm 16mm 9.9mm;
    background: #fff;
    color: #000;
    box-shadow: 0 2px 18px rgba(0, 0, 0, 0.18);
  }

  .photo {
    position: absolute;
    right: 14mm;
    bottom: 14mm;
    width: 12mm;
    height: 12mm;
    object-fit: cover;
  }

  .toolbar {
    position: fixed;
    top: 18px;
    right: 18px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status {
    font-size: 12px;
    color: #555;
  }
  .status.error {
    color: #b00;
  }
  .btn {
    padding: 10px 16px;
    /* Same typeface as the resume title (Helvetica Neue stack), bold. */
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #fff;
    background: #000;
    border: 1px solid #000;
    border-radius: 0;
    cursor: pointer;
  }
  .btn:hover {
    color: #000;
    background: #fff;
  }
  .btn.active {
    color: #000;
    background: #fff;
  }

  /* The page IS the PDF: hide chrome and drop the screen framing when printing. */
  @media print {
    .toolbar {
      display: none;
    }
    .page {
      margin: 0;
      box-shadow: none;
      width: auto;
      min-height: auto;
    }
  }
</style>
