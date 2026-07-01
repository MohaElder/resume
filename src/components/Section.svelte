<script>
  import Entry from './Entry.svelte'
  import Editable from './Editable.svelte'
  let { section, editing = false } = $props()
</script>

<section class="section">
  <Editable
    tag="h2"
    class="heading"
    {editing}
    value={section.heading}
    onchange={(v) => (section.heading = v)}
  />
  <div class="columns">
    {#each section.entries as entry}
      <Entry {entry} {editing} />
    {/each}
  </div>
</section>

<style>
  .section {
    margin-top: 7mm;
  }
  /* :global() because .heading is rendered by the <Editable> child component. */
  .section :global(.heading) {
    display: block;
    font-size: 10pt;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: #000;
    margin: 0 0 5mm;
  }
  .columns {
    column-count: 2;
    column-gap: 10.6mm;
  }
</style>
