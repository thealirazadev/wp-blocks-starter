# Testing Strategy: WP Blocks Starter

## Philosophy

This is a small, mostly front-end block plugin with no database and no custom server logic, so the testing weight is: linting and type checking (fast, catches most regressions), a thin layer of JS unit tests for pure logic, and manual QA in a real WordPress editor for the editing experience. End-to-end tests are provided as scaffolding for the editing round-trip but are optional to run locally because they require the wp-env container.

Rule: `npm run build` plus the lint and unit test commands must all pass before any feature is considered done. A feature that fails the build is not done, regardless of how it looks in the browser.

## Automated tests

### Linting and formatting (primary safety net)

- `npm run lint:js` — ESLint via `@wordpress/scripts` over `src/`, using `@wordpress/eslint-plugin` plus TypeScript rules. Catches unused attributes, bad imports (for example importing React directly), and i18n mistakes.
- `npm run lint:css` — stylelint over SCSS, enforcing the WordPress stylelint config and BEM-under-block-root conventions.
- `npm run lint:php` — PHPCS with the WordPress standard over PHP files, enforcing prefixes (`wpbs_`/`WPBS_`), the text domain, and escaping rules.
- `npm run format` — Prettier (`wp-scripts format`) to auto-fix JS/TS/SCSS formatting. Not a test, but run before committing.

### Type checking

- TypeScript type checking runs as part of `lint:js` config (ts-aware ESLint) and can be run standalone with `npx tsc --noEmit`. Attribute shapes are typed via `CalloutAttributes` in `src/callout/types.ts` so `edit` and `save` cannot drift.

### Unit tests (Jest via wp-scripts)

- `npm run test:unit` — `wp-scripts test-unit-js` runs Jest. Cover pure logic only: the icon-name validation, heading-level clamping (2 to 4), and the accent-slug-to-CSS-variable mapping. Do not unit test WordPress internals or the editor DOM here.
- Test files live next to the code as `*.test.ts` (for example `src/callout/constants.test.ts`).

### End-to-end tests (Playwright via wp-scripts, optional locally)

- `npm run test:e2e` — `wp-scripts test-e2e` drives a real editor. Requires `npm run env:start` first. Covers the critical round-trip: insert Callout, type heading/body, set icon and accent, save, reload, assert no validation error and that content/attributes persisted. Keep this suite small; it is the highest-value but slowest test.

## Manual QA

Manual testing is the primary way we validate the editing experience, because the value of the block is how it feels in Gutenberg. For each phase, run the "Manual test checklist" in `docs/phases.md` and the shared "Phase verification" list (unhappy paths, empty states, long inputs). Do manual QA in wp-env with at least the default block theme, and spot-check one other block theme to confirm `theme.json` tokens resolve.

## Exact commands

```bash
# Install
npm install
composer install            # optional: enables lint:php

# Build (must pass before a feature is done)
npm run build               # production build to build/
npm start                   # watch build during development

# Local WordPress
npm run env:start           # http://localhost:8888 (admin: http://localhost:8888/wp-admin)
npm run env:stop

# Tests and checks (all must pass before done)
npm run lint:js
npm run lint:css
npm run lint:php            # requires composer install
npm run test:unit
npx tsc --noEmit            # standalone type check

# End-to-end (optional locally; requires env:start first)
npm run test:e2e

# Formatting
npm run format
```

## package.json script names (target)

These are the script names the above commands assume; wire them in Phase 1:

- `start` -> `wp-scripts start`
- `build` -> `wp-scripts build`
- `lint:js` -> `wp-scripts lint-js`
- `lint:css` -> `wp-scripts lint-style`
- `lint:php` -> `composer run lint` (PHPCS)
- `format` -> `wp-scripts format`
- `test:unit` -> `wp-scripts test-unit-js`
- `test:e2e` -> `wp-scripts test-e2e`
- `env:start` -> `wp-env start`
- `env:stop` -> `wp-env stop`
- `plugin-zip` -> `wp-scripts plugin-zip`

## Definition of "tests pass"

Before marking any feature done: `npm run build` exits 0, and `npm run lint:js`, `npm run lint:css`, `npm run lint:php`, and `npm run test:unit` exit 0, with no new browser console errors or PHP notices during a manual smoke test of the changed behavior.
