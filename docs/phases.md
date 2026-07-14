# Build Phases: WP Blocks Starter

Phases are ordered smallest-useful-shippable first. Each phase ends in a plugin that builds, lints, and can be activated. Do not start a phase before the previous one meets its Definition of done. Commits follow Conventional Commits, one per feature/task, in the listed order.

---

## Phase 1: Plugin scaffold and build pipeline

Goal: an activatable plugin that compiles a block from `src/` to `build/` and registers it, with all tooling wired up. The block can be a minimal Callout skeleton (renders a static wrapper with placeholder text) so the pipeline is provable end to end.

### Definition of done

- `npm install` (and optional `composer install`) succeed with committed lockfiles.
- `npm run build` exits 0 and creates `build/callout/block.json`, `index.js`, `index.asset.php`, and CSS files.
- `wp-blocks-starter.php` registers the block by scanning `build/` and guards a missing `build/` with a single admin notice (no fatal).
- After `npm run env:start` and activation, a "Callout" block appears in the inserter and inserts a placeholder without console or PHP errors.
- `npm run lint:js`, `npm run lint:css`, `npm run lint:php` exit 0.

### Manual test checklist

- Run `npm run build`; open `build/callout/` and confirm the expected files exist. Expect: all present.
- Run `npm run env:start`, open `http://localhost:8888/wp-admin`, activate "WP Blocks Starter". Expect: activates cleanly, no notice.
- Temporarily rename `build/`; reload wp-admin. Expect: one plain admin notice telling you to run `npm run build`, no fatal error. Restore `build/`.
- Create a post, open the inserter, search "Callout". Expect: the block appears and inserts a placeholder.
- Open the browser console. Expect: no errors from the plugin.

### Commits

- `chore(build): scaffold package.json and wp-scripts npm scripts`
- `chore(tooling): add tsconfig, eslint, prettier, stylelint, phpcs configs`
- `chore(env): add wp-env config and gitignore`
- `feat(plugin): add plugin bootstrap and constants`
- `feat(blocks): register blocks from build directory with missing-build notice`
- `feat(callout): add minimal block.json and index entry with placeholder render`

---

## Phase 2: Callout editable content (static block)

Goal: the Callout block has real editable heading and body via RichText, saved statically to post content, round-tripping without validation errors.

### Definition of done

- `edit.tsx` renders `useBlockProps`, a `RichText` heading, and a `RichText` body with placeholders.
- `save.tsx` outputs `useBlockProps.save` with `RichText.Content` for heading (`h2`) and body (`p`).
- `block.json` declares `heading` and `body` attributes with correct `source`/`selector`.
- Saving and reloading shows no "invalid content" error; content appears on the front end.

### Manual test checklist

- Insert a Callout, type a heading and body, save the post. Expect: saves without error.
- Reload the editor. Expect: no block-validation warning; content intact.
- View the post on the front end. Expect: heading and body render with the block styles.
- Type a very long heading and body. Expect: text wraps, no horizontal overflow.
- Insert two Callouts in one post, give different content, save, reload. Expect: both persist independently.

### Commits

- `feat(callout): add heading and body attributes to block.json`
- `feat(callout): render editable heading and body in edit component`
- `feat(callout): add static save output for heading and body`
- `feat(callout): add base block styles for editor and front end`

---

## Phase 3: Inspector controls (icon, accent color, heading level)

Goal: authors can pick an icon, an accent color from the theme palette, and a heading level; choices persist and render on the front end.

### Definition of done

- `InspectorControls` panel exposes icon select and theme-palette accent color; a heading-level control exists in the block toolbar (and/or inspector), kept in sync.
- `icon`, `accentColor`, and `headingLevel` attributes are declared, validated to their allowed sets in code, and consumed by both `edit` and `save`.
- Accent color is stored as a preset slug and rendered via `var(--wp--preset--color--{slug})`, not a raw hex.
- Icons come from `icons.tsx` as inline SVG with `aria-hidden="true"`.

### Manual test checklist

- Change the icon in the sidebar. Expect: editor preview and saved/front-end markup update.
- Pick an accent color from the palette, save, reload, view front end. Expect: accent (border/icon) reflects the theme token and persists.
- Clear the accent color. Expect: falls back to the neutral default, no error.
- Change heading level to H3 then H4. Expect: rendered tag changes in editor and front end.
- Save with an empty heading and empty body but a chosen icon/color. Expect: no crash; placeholders in editor, minimal but valid front-end markup.

### Commits

- `feat(callout): add icon, accentColor, and headingLevel attributes`
- `feat(callout): add inline svg icon set`
- `feat(callout): add inspector panel for icon and accent color`
- `feat(callout): add heading level control to the block toolbar`
- `feat(callout): apply icon, accent token, and heading level in save output`

---

## Phase 4: Style variations, accessibility, and i18n polish

Goal: three registered style variations, verified accessibility, and translation-ready strings; the block is a complete copy-this reference.

### Definition of done

- `block.json` declares `default`, `bordered`, and `filled` styles (`default` is default); each is implemented in `style.scss` and visibly distinct on the front end.
- All user-facing strings use `@wordpress/i18n` with the `wp-blocks-starter` text domain; a `.pot` file is generated in `languages/`.
- Default combinations for each variation meet WCAG AA contrast (verified and noted in `docs/memory.md`).
- Focus states visible on all controls; heading is semantic; icon is `aria-hidden`.

### Manual test checklist

- Open the Styles panel, switch between Default / Bordered / Filled. Expect: each looks distinct in editor and front end and persists across reload.
- Tab through inspector and toolbar controls. Expect: visible focus ring on each.
- Inspect front-end markup. Expect: real heading tag, `<p>` body, `aria-hidden="true"` on the icon.
- Switch the active theme to a different block theme. Expect: colors/spacing/typography still look intentional (tokens resolve).
- Run a contrast check on Filled variation body text. Expect: >= 4.5:1.

### Commits

- `feat(callout): register default, bordered, and filled style variations`
- `feat(callout): style the three variations with theme tokens`
- `feat(callout): wrap user-facing strings for translation`
- `chore(i18n): generate wp-blocks-starter.pot`
- `docs(a11y): record contrast and accessibility verification in memory`

---

## Phase verification (run at the end of every phase)

- Run the app: `npm run build`, `npm run env:start`, activate the plugin; confirm the phase's features work in wp-admin and on the front end.
- Run tests: `npm run lint:js`, `npm run lint:css`, `npm run lint:php`, `npm run test:unit` all exit 0. Build must pass before a feature is called done.
- Check console/logs: no browser console errors, no PHP notices/warnings in the wp-env log (`npm run env:logs` if configured, or the Docker logs).
- Unhappy paths:
  - Wrong input: set heading level via the control to each allowed value; confirm out-of-range values are impossible through the UI and clamped in code.
  - Empty forms: save a Callout with empty heading and body; confirm no crash and valid markup.
  - No network: front-end rendering must not depend on network (it is static HTML/CSS); load the published page offline after first load. Expect: renders.
  - Duplicate submit: click Save/Update twice quickly. Expect: no duplicate blocks, no error.
  - Refresh mid-action: type content, refresh before saving. Expect: WordPress autosave/recovery behaves normally; no corruption.
- Empty states: freshly inserted block shows placeholders and a coherent default appearance.
- Long inputs: multi-paragraph body and a very long heading wrap without horizontal overflow in editor and front end.

## Backlog

(empty)
