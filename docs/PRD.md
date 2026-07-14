# Product Requirements: WP Blocks Starter

## What we're building

A WordPress plugin that serves as a starter/boilerplate for building modern Gutenberg blocks. It demonstrates the current block workflow end to end (a `block.json` manifest at `apiVersion: 3`, a `@wordpress/scripts` build, and a TypeScript + React editor) and ships one complete, production-quality example block, `wp-blocks-starter/callout`. The Callout block is the reference implementation developers copy and adapt to create their own blocks, so its structure, naming, and comments matter as much as its behavior.

## Target user

A WordPress plugin or theme developer who knows JavaScript and PHP but wants a correct, up-to-date foundation for custom blocks. They are frustrated by outdated tutorials that use `apiVersion` 1/2, inline PHP `render_callback` for everything, or hand-rolled webpack. They want to clone this repo, run one build command, see a working block, and understand exactly which file to change to add their own.

## Core features (prioritized)

1. Working block registration pipeline (highest priority)
   - A plugin that registers blocks by scanning `build/` for `block.json` manifests via `register_block_type`.
   - `@wordpress/scripts` build (`npm run build`, `npm start`) compiling TypeScript, JSX, and SCSS from `src/` into `build/`.

2. Editable Callout block content
   - A `Callout` block insertable from the block inserter under the Text category.
   - Editable heading and body text using `RichText`, stored as block attributes in post content.
   - Correct save output that round-trips (no block validation errors on reload).

3. Block options via editor controls
   - An `InspectorControls` sidebar panel with an icon selector (Info, Success, Warning, Tip) and an accent color chosen from the theme palette.
   - A block toolbar control (or inspector control) to set the heading level (h2 to h4).

4. Block style variations
   - Three registered style variations (Default, Bordered, Filled) that visibly change the rendered block and are switchable from the editor Styles panel.

5. Accessible, theme-aware rendering
   - Semantic markup, a configurable heading level, decorative icons hidden from assistive tech, visible focus states in the editor, and colors/spacing/typography sourced from `theme.json` tokens.

6. Quality tooling as part of the starter
   - Linting (ESLint, stylelint, PHPCS), formatting (Prettier), i18n with a text domain, and unit + e2e test scaffolding wired into npm scripts.

## Non-goals / out of scope

- No database, custom tables, custom post types, or settings/admin pages. All block data lives in post content as block attributes.
- No REST API endpoints or AJAX handlers.
- No block collection beyond the single Callout example; this is a starter, not a block library.
- No block patterns, block templates, or full-site-editing templates.
- No user authentication, roles, or capability management beyond WordPress defaults for editing posts.
- No bundled front-end framework beyond what WordPress provides (React comes from `@wordpress/element`; nothing is shipped in the frontend bundle that WordPress does not already load).
- No IE11 or legacy-browser support; targets are the browsers WordPress core currently supports.
- No automated publishing to the WordPress.org plugin directory.

## Success criteria per core feature

1. Block registration pipeline
   - `npm run build` exits 0 and produces `build/callout/block.json`, `index.js`, `index.asset.php`, `style-index.css`, and `index.css`.
   - After `npm run env:start` and plugin activation, the Callout block appears in the inserter with no PHP notices or console errors.

2. Editable Callout content
   - A user can insert a Callout, type into the heading and body, save the post, and reload the editor with no "This block contains unexpected or invalid content" error.
   - The saved heading and body appear on the published front end.

3. Block options
   - Changing the icon updates the editor preview and the saved/front-end markup.
   - Choosing an accent color updates the accent (border/icon) using a theme preset token, and the choice persists across reload.
   - Changing the heading level changes the rendered tag from `h2` to the selected `h3` or `h4` in both editor and front end.

4. Style variations
   - All three variations appear in the editor Styles panel; selecting each applies a distinct visual style on the front end; the selected variation persists across reload.

5. Accessible rendering
   - Rendered markup uses a real heading element and a `<p>` body; the icon carries `aria-hidden="true"`.
   - Default accent-on-background combinations meet WCAG AA contrast (4.5:1 for body text).
   - Keyboard focus is visible on all editor controls.

6. Quality tooling
   - `npm run lint:js`, `npm run lint:css`, `npm run lint:php`, and `npm run test:unit` all exit 0 on a clean checkout after install.
