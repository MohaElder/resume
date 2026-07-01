<script>
  import { renderMarkdown } from '../lib/markdown.js'

  // Inline click-to-edit Markdown. In normal mode it renders parsed Markdown
  // (links / **bold** / *italic* / `code`). When `editing` is true it shows the
  // raw Markdown source in a contenteditable element.
  // Enter commits; Shift+Enter inserts a line break; Esc cancels.
  let {
    value,
    editing = false,
    onchange,
    tag = 'span',
    class: klass = '',
  } = $props()

  let el
  const html = $derived(renderMarkdown(value))

  function commit() {
    // Preserve intentional line breaks; tidy non-breaking spaces, runs of blank
    // lines, and leading/trailing whitespace. The raw Markdown source is saved.
    const text = el.innerText
      .replace(/ /g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    if (text !== value) onchange?.(text)
    else el.innerText = value
  }

  function onkeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      el.blur()
    } else if (e.key === 'Escape') {
      el.innerText = value
      el.blur()
    }
  }
</script>

{#if editing}
  <svelte:element
    this={tag}
    bind:this={el}
    class={`ed ${klass} editable`}
    contenteditable="true"
    role="textbox"
    tabindex="0"
    spellcheck="true"
    onblur={commit}
    onkeydown={onkeydown}>{value}</svelte:element>
{:else}
  <svelte:element this={tag} class={`ed ${klass}`}>{@html html}</svelte:element>
{/if}

<style>
  /* Preserve newlines (from Shift+Enter) in both view and edit modes, while still
     wrapping normally. Applies to every Editable-rendered element. */
  .ed {
    white-space: pre-wrap;
  }
  .editable {
    cursor: text;
    border-radius: 1px;
    transition: background 0.12s, box-shadow 0.12s;
    min-width: 0.5em;
  }
  .editable:hover {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.18);
  }
  .editable:focus {
    outline: none;
    background: rgba(255, 230, 130, 0.45);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  }
  .editable:empty::after {
    content: '…';
    opacity: 0.35;
  }
</style>
