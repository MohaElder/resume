# Resume — Oh Yasushi

A pixel-faithful, data-driven recreation of the resume PDF, built with Svelte + Vite.
The **Print** button uses the browser's print-to-PDF, so the saved file is an
exact copy of what's on screen (A4, buttons hidden).

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static build → dist/
npm run preview  # preview the production build
```

## Edit the content

There are two ways to edit. Both read/write the same repo-tracked "database":
**`src/data/resume.json`**.

### 1. In-browser (tap to edit)

While running `npm run dev` (or `npm run preview`):

1. Click **Edit** (top-right). Every field becomes click-to-edit, showing its raw
   **Markdown** source.
2. Click a field, type, then click away (or press **Enter**) to commit.
   **Shift+Enter** inserts a line break; **Esc** cancels.
3. Each change auto-saves back to `src/data/resume.json` — watch the **Saving… / Saved ✓**
   indicator. Commit the file to keep your edits.

Editing requires the dev/preview server (it provides the save endpoint); a purely static
build is read-only and will show "Not saved (no server)".

### 2. Directly in the JSON

Edit **`src/data/resume.json`**:

- `profile` — names (EN / 中文 / 日本語 / ไทย), `contacts` (array of Markdown strings), tagline, photo
- `sections` — ordered list. Each is either:
  - `{ heading, entries: [...] }` → two-column experience block
  - `{ heading, links: [...] }` → single-column list

To **add / edit / remove** a section or entry, just change the array. Entries flow
into two balanced columns automatically.

- An entry: `{ org, role, period, description }` — all fields are Markdown.
- A links section: `links` is an array of Markdown strings (e.g. `"[Title](https://…) - Source"`).

### Markdown

Every text field is Markdown. Supported inline: `[text](url)` links, `**bold**`,
`*italic*`, and `` `code` ``. Links render black + underlined (contacts stay plain);
URLs are sanitized. Rendering lives in `src/lib/markdown.js`.

To revert edits, use `git checkout src/data/resume.json`.

## Photo

Drop a square image at `public/photo.jpg` to show it bottom-right (as in the PDF).
If the file is missing it's simply hidden. Change the path via `profile.photo` (set to `null` to disable).

## Print / save as PDF

Click **Print** → in the print dialog choose "Save as PDF". Set margins to
**None** and enable **Background graphics** for the closest match.

## Notes / TODO

- A few link URLs in `resume.json` are placeholders — fill in the real ones.
- `OpenEnlarge`'s description is duplicated from `Aako Inc` in the source PDF; update when you have the real copy.
