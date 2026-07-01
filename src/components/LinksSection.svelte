<script>
  import Editable from './Editable.svelte'
  // `section.links` is an array of Markdown strings (e.g. "[Title](url) - Source").
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
  <ul class="links">
    {#each section.links as item, i}
      <li>
        <Editable {editing} value={item} onchange={(v) => (section.links[i] = v)} />
      </li>
    {/each}
  </ul>
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
  .links {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .links li {
    font-size: 9.3pt;
    line-height: 1.5;
    color: #000;
  }
</style>
