<script>
  import Editable from './Editable.svelte'
  let { profile, editing = false } = $props()
</script>

<header class="header">
  <div class="names">
    <Editable
      tag="h1"
      class="name"
      {editing}
      value={profile.name}
      onchange={(v) => (profile.name = v)}
    />
    <div class="alt">
      <Editable {editing} value={profile.nameZh} onchange={(v) => (profile.nameZh = v)} />
      <span class="sep">/</span>
      <Editable {editing} value={profile.nameJp} onchange={(v) => (profile.nameJp = v)} />
    </div>
    <div class="alt th">
      <Editable {editing} value={profile.nameTh} onchange={(v) => (profile.nameTh = v)} />
    </div>
  </div>

  <div class="meta">
    <div class="contacts">
      {#each profile.contacts as contact, i}
        <Editable
          class="contact"
          {editing}
          value={contact}
          onchange={(v) => (profile.contacts[i] = v)}
        />
      {/each}
    </div>
    <Editable
      tag="div"
      class="tagline"
      {editing}
      value={profile.tagline}
      onchange={(v) => (profile.tagline = v)}
    />
  </div>
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10mm;
  }
  /* :global() because these elements are rendered by the <Editable> child component,
     so this component's normal scoped styles wouldn't reach them. */
  .names :global(.name) {
    display: block;
    font-size: 12pt;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #000;
    margin: 0;
  }
  .alt {
    font-size: 10pt;
    color: var(--muted);
    margin-top: 2mm;
  }
  .alt.th {
    margin-top: 0.8mm;
  }
  .sep {
    margin: 0 0.15em;
  }

  .meta {
    text-align: left;
    padding-top: 0.5mm;
  }
  .contacts {
    display: grid;
    grid-template-columns: auto auto;
    gap: 1mm 9mm;
    font-size: 8pt;
  }
  .contacts :global(.contact) {
    color: #000;
    white-space: nowrap;
  }
  /* Contact links stay plain (black, no underline) to match the PDF. */
  .contacts :global(a) {
    color: #000;
    text-decoration: none;
  }
  .meta :global(.tagline) {
    font-size: 8pt;
    font-weight: 700;
    color: #000;
    margin-top: 2.5mm;
  }
</style>
