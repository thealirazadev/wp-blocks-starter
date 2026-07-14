# Engineering Rules: WP Blocks Starter

These rules are binding for anyone (or any tool) writing code in this repository. They are specific to a WordPress block plugin built with `@wordpress/scripts`.

## Conventions

### Preferred libraries and patterns

- Editor UI: use `@wordpress/components` (`PanelBody`, `SelectControl`, `RangeControl`, `ToggleGroupControl`, `__experimentalToolsPanel` only if stable) and `@wordpress/block-editor` (`RichText`, `InspectorControls`, `BlockControls`, `useBlockProps`, `PanelColorSettings` or `useSettings` for palette). Do not hand-roll form controls or DOM manipulation.
- Colors/spacing/typography: read from `theme.json` presets. Reference palette slugs and emit CSS custom properties (`var(--wp--preset--color--{slug})`, `var(--wp--preset--spacing--{slug})`). Do not hardcode hex colors or pixel spacing in component logic; SCSS may use tokens and a small set of documented local variables only.
- Block metadata: declare everything possible in `block.json` (attributes, `supports`, `styles`, file references). Prefer declarative manifest over imperative JS registration.
- Internationalization: wrap every user-facing string in `@wordpress/i18n` (`__`, `_x`, `sprintf`) with the text domain `'wp-blocks-starter'`.
- PHP: use `register_block_type` reading `block.json`. Keep PHP thin; no business logic that JS should own.

### What to avoid

- `apiVersion` 1 or 2. This starter is `apiVersion: 3` only.
- Inline `render_callback` closures in PHP for the static example. Dynamic rendering, when demonstrated, goes in `render.php` referenced from `block.json`.
- `@wordpress/components` APIs marked `__unstable`. `__experimental` APIs are allowed only when there is no stable equivalent, and each use must be noted in `docs/memory.md`.
- jQuery, Lodash, Underscore, and adding React directly to `dependencies` (React comes from `@wordpress/element`).
- Enqueuing scripts/styles by hand when `block.json` file references already do it.
- Global CSS. All selectors live under the block's root class (`.wpbs-callout`).

### Naming

- PHP files: lowercase-hyphenated (`blocks.php`, `i18n.php`). Class files, if any, `class-{name}.php`.
- PHP functions: prefix `wpbs_` and snake_case (`wpbs_register_blocks`). Constants: prefix `WPBS_` (`WPBS_VERSION`). Namespace, if used: `WPBlocksStarter`. Text domain: `wp-blocks-starter`. Hook prefixes for any custom hooks: `wpbs_`.
- Block name: `wp-blocks-starter/callout` (namespace matches plugin slug).
- TS/JS files: lowercase, `edit.tsx`, `save.tsx`, `controls.tsx`, `icons.tsx`, `types.ts`, `constants.ts`. Entry is `index.ts`.
- React components: PascalCase (`CalloutEdit`, `CalloutInspector`, `CalloutIcon`).
- Functions/variables in JS/TS: camelCase (`setAttributes`, `accentColor`).
- Types/interfaces: PascalCase (`CalloutAttributes`, `IconName`).
- CSS classes: BEM under the block root, `wpbs-` prefix (`.wpbs-callout`, `.wpbs-callout__heading`, `.wpbs-callout__icon`, `.wpbs-callout--icon-info`). Style variations use WordPress's `is-style-{name}` classes.
- Constants in JS: UPPER_SNAKE_CASE (`ICON_OPTIONS`, `HEADING_LEVELS`).

### Commit message format

- Conventional Commits: `type(scope): imperative subject`. Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`. Optional scope is the area, e.g. `callout`, `build`, `phpcs`. Subject is lowercase, imperative, no trailing period, under ~72 chars. Example: `feat(callout): add inspector icon selector`.
- ONE COMMIT PER FEATURE/TASK. Never batch multiple features into one commit. Each commit should build and pass lint. The per-commit list for each phase is in `docs/phases.md`; follow that order.

### Dependencies and migrations

- Pin exact versions in `package.json` and `composer.json` (no `^`/`~`). Commit `package-lock.json` and, if Composer is used, `composer.lock`.
- No new runtime or dev dependency without explicit approval (see Boundaries).
- Migrations: not applicable. There is no database and no schema. If a future change alters saved block markup in a way that breaks existing content, add a `deprecated` entry in the block registration (block deprecations are Gutenberg's migration mechanism) rather than changing `save` in place, and note it in `docs/memory.md`.

## Error handling and logging

- Every external call handles failure. The "external" surface here is small: PHP `register_block_type` and file/manifest reads, and editor calls into WordPress data stores.
  - In PHP, guard file existence before registering: check that each `build/{block}/block.json` exists before calling `register_block_type`; if `build/` is missing, do not fatal, and surface a single admin notice telling the developer to run `npm run build`.
  - In JS, code defensively around attribute values that may be empty on first insert (empty `heading`/`body`, empty `accentColor`); never assume a value is present.
- Friendly user errors vs detailed logs: end users (post authors) should never see stack traces or PHP notices. A missing build produces one plain admin notice ("WP Blocks Starter: run `npm run build` to compile blocks"), not a fatal. Detailed context (which file was missing) goes to the log, not the screen.
- No stack traces to users. `WP_DEBUG` may print to logs in development, but rendered block output and admin UI never expose internals.
- One consistent error format. PHP: prefix every logged line with `[wp-blocks-starter]` via a single small logging helper. JS: prefix `console` output with `[wp-blocks-starter]`. Do not scatter ad-hoc formats.
- Structured logging from day one. Provide one PHP helper `wpbs_log( $level, $message, array $context = [] )` that writes `[wp-blocks-starter] {LEVEL} {message} {json-context}` via `error_log` only when `WP_DEBUG` is on. Use it for the missing-build case. Do not add a logging framework; this helper is enough.

## Security

- No hardcoded secrets, tokens, or credentials anywhere. This project needs none; if that ever changes, use environment configuration, never source.
- `.env` and `.env.example`: this project has no runtime secrets and intentionally ships neither. Do not add a `.env`. wp-env config in `.wp-env.json` contains no secrets.
- Validate all input server-side. Any attribute consumed in PHP (only relevant if you enable the dynamic `render.php` path) must be validated and constrained: `icon` checked against the allowed set, `headingLevel` clamped to 2 to 4, `accentColor` matched against the known preset slugs. Never echo an attribute into an HTML tag name or attribute without validation.
- Sanitize rendered input. In `render.php` (dynamic path), escape on output: `esc_html`/`wp_kses_post` for text, `esc_attr` for attribute values, `esc_url` for URLs. For RichText content that allows inline formatting, use `wp_kses_post`. In the static JS `save`, use `RichText.Content` (which handles safe serialization) rather than injecting raw HTML.
- Parameterized queries: not applicable (no database). If a future feature adds queries, use `$wpdb->prepare` exclusively; never interpolate variables into SQL.
- Protected actions/capabilities: editing a post that contains blocks is gated by WordPress's existing `edit_posts` capability; we add no new capabilities and no privileged actions. Document here if that ever changes. There are no admin-post, AJAX, or REST endpoints to protect in this project.

## Simplicity (YAGNI / KISS)

- Write the minimum code that satisfies the current phase in `docs/phases.md`. Do not build for hypothetical future blocks; the pattern is the value, not premature abstraction.
- Rule of three: do not extract a shared helper/partial until the same code appears three times. The single Callout block should not spawn a "block framework."
- No new wrapper, factory, manager, or `utils` module without approval. `constants.ts` and `icons.tsx` are the only shared modules planned; anything beyond them needs sign-off.
- No unused flags, options, or config. Every `block.json` attribute and every control must be used by both `edit` and `save`. Remove dead `supports` entries.
- Pause and justify past ~150 lines. If a single file (component or PHP file) grows beyond roughly 150 lines, stop and reconsider the split before continuing; record the reasoning in `docs/memory.md`.
- Use existing libraries. Reach for `@wordpress/components` and `@wordpress/block-editor` before writing custom UI or state code.

## Code style

- Comments are sparse and human: explain why, not what. Do not narrate obvious code. A brief note on non-obvious WordPress behavior (for example, why `save` must not change markup once content exists) is welcome.
- Docstrings are concise. PHP functions get a short PHPDoc with `@param`/`@return`. Exported TS functions/types get a one-line description when the name is not self-explanatory.
- No emoji anywhere in code, comments, commits, or docs.
- No AI/authorship mentions anywhere (no "generated by", no "co-authored by", no tool names).
- Conventional Commits, one per feature (see Conventions above).
- Follow `@wordpress/eslint-plugin` + Prettier for JS/TS and the WordPress standard (PHPCS) for PHP. Let the formatters win; do not hand-fight them.

## Boundaries

- No wholesale file deletion or rewrite. Make targeted edits. If a file genuinely must be replaced, flag it and explain why before doing so.
- Never change `docs/PRD.md` or `docs/architecture.md` without flagging the change first and getting agreement. These are the source of truth for scope and design.
- No new dependency (npm or Composer) without explicit approval. Prefer what WordPress core already provides.
- Ask when ambiguous. If a requirement in the docs is unclear or two rules conflict, stop and ask rather than guessing.
- Stop after 2 failed fix attempts on the same problem. Do not loop. Summarize what was tried, what failed, and the current hypothesis, then ask for direction.
- Scope changes are routed explicitly: a change either fits the current phase, becomes a new phase, or goes to the Backlog in `docs/phases.md`. State which bucket you chose and why. Do not silently expand a phase.
