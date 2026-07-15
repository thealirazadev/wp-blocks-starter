# Project Memory: WP Blocks Starter

Running log of project state and decisions. Keep entries short. Log every non-obvious decision with its reason so future work does not relitigate it.

## Completed

- Planning documentation created (README, PRD, architecture, rules, design, phases, testing, memory, launch-checklist).

## In progress

- Phase 3 (inspector controls) starting next.

## Decisions log

- Phase 2 complete: `heading`/`body` attributes, `edit.tsx`/`save.tsx` split out of `index.ts` (matching the planned file tree in `docs/architecture.md`), and a shared `_callout.scss` partial used from `style.scss` for base layout (padding, accent border, heading/body spacing) using `theme.json` spacing/color preset tokens with sane fallbacks.
- Fixed `.eslintrc.js` to extend `plugin:@wordpress/eslint-plugin/recommended` instead of `recommended-with-formatting`. Reason: `recommended-with-formatting` does not include the conditional TypeScript override (parser, import resolver extensions) that `recommended` layers on when `typescript` is installed; without it, ESLint failed on `.tsx` files and on extensionless relative imports (`./edit`, `./save`) with `no-undef`/`import/no-unresolved`. `@typescript-eslint/*` packages were already present in `node_modules` as a dependency of `@wordpress/eslint-plugin`, so this is a config correction, not a new dependency.
- Added a `selector-class-pattern` override to `.stylelintrc.json`. Reason: the default WordPress stylelint pattern only allows kebab-case, which rejects the BEM `__`/`--` class names mandated by `docs/rules.md`. The override allows `wpbs-` prefixed BEM classes and core `is-style-*` variation classes only.
- `wp-env start` could not complete: the sandbox has no outbound network access, so Docker image/tarball downloads for the WordPress environment time out (`ETIMEDOUT`). Verification for phases 2-4 falls back to `npm run build`, `lint:js`, `lint:css`, `lint:php`, `test:unit`, and `npx tsc --noEmit`. This is noted per phase; live wp-env manual QA (inserter, front-end round-trip, console/PHP-notice checks) was not run and should be done by a developer with network access before release.

- Shipped example block is static (attributes serialize into post content via `save`), matching the "attributes stored in post content" data model. Reason: most blocks are static and it is the simpler, clearer reference. The dynamic path (`render.php` + `render_callback` via a `block.json` `render` key) is documented and stubbed but left unused so both patterns are visible without adding server complexity to the default.
- `apiVersion: 3` chosen deliberately (not 1 or 2). Reason: v3 renders the editor block in the same iframe as the front end, so editor and front-end styles match, which is the modern-workflow lesson this starter exists to teach.
- Accent color stored as a theme color preset slug, not a raw hex, and rendered via `var(--wp--preset--color--{slug})`. Reason: keeps output theme-token-driven so the block looks correct in any theme; a hardcoded hex would break portability.
- Block style variations declared in `block.json` `styles` (declarative) rather than imperative `registerBlockStyle`. Reason: no per-variation JS preview generator is needed, so the manifest is the simplest correct place.
- Heading level constrained to h2 to h4 (no h1, no h5/h6 by default). Reason: h1 is reserved for the page title; a shallow, bounded range keeps document outlines sane. Recorded so nobody "helpfully" adds h1.
- Composer/PHPCS kept optional and separate from the JS build. Reason: the block builds and runs with npm alone; PHP standards tooling should not block a contributor who only edits TS/SCSS.
