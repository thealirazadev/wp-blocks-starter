# Testing Strategy: WP Blocks Starter

## Philosophy

This is a small, mostly front-end block plugin with no database and no custom server logic, so the testing weight is: linting and type checking (fast, catches most regressions), a thin layer of JS unit tests for pure logic, and manual QA in a real WordPress editor for the editing experience. There are no end-to-end tests; the editing round-trip is checked manually (see below).

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
- Test files live next to the code as `*.test.ts`: `src/callout/constants.test.ts` covers the three helpers and `src/callout/block.test.ts` checks the manifest identity (`apiVersion`, name, text domain).

### End-to-end tests (not included)

The repository ships no end-to-end suite and no `test:e2e` script. An earlier `test:e2e` script pointed at `wp-scripts test-e2e` (the legacy Puppeteer runner, not Playwright) with no specs, no config and no e2e dependencies, so it could not run anything; it was removed rather than left looking like coverage. If you add one, use `wp-scripts test-playwright` with `@playwright/test` and `@wordpress/e2e-test-utils-playwright` as dev dependencies, and cover the critical round-trip: insert Callout, type heading/body, set icon and accent, save, reload, assert no validation error and that content/attributes persisted.

## Manual QA

Manual testing is the primary way we validate the editing experience, because the value of the block is how it feels in Gutenberg. Do manual QA in wp-env with at least the default block theme, and spot-check one other block theme to confirm `theme.json` tokens resolve.

Checklist:

- `npm run build`, then activate the plugin: it activates cleanly. With `build/` renamed away, wp-admin shows one notice telling you to run `npm run build` and no fatal error.
- Insert a Callout, type a heading and body, save, reload: no block-validation warning and the content is intact; the front end renders with the block styles. Two Callouts in one post persist independently.
- Change the icon, pick an accent from the palette, clear it, and switch the heading between H2, H3 and H4: the editor and front end update and persist, and a cleared accent falls back to the neutral default.
- Switch between Default, Bordered and Filled: each looks distinct and persists across reload. Run a contrast check on Filled body text (at least 4.5:1).
- Tab through the inspector and toolbar controls: each has a visible focus ring. Front-end markup has a real heading tag, a `<p>` body and `aria-hidden="true"` on the icon.
- Edge cases: an empty heading and body save without a crash and with valid markup; a very long heading and multi-paragraph body wrap without horizontal overflow; double-clicking Update creates no duplicate blocks; the published page renders without network access.
- No browser console errors and no PHP notices in the wp-env log.

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

# Formatting
npm run format
```

## package.json script names

These are the scripts defined in `package.json`:

- `start` -> `wp-scripts start`
- `build` -> `wp-scripts build`
- `lint:js` -> `wp-scripts lint-js`
- `lint:css` -> `wp-scripts lint-style`
- `lint:php` -> `composer run lint` (PHPCS)
- `format` -> `wp-scripts format`
- `test:unit` -> `wp-scripts test-unit-js`
- `env:start` -> `wp-env start`
- `env:stop` -> `wp-env stop`
- `plugin-zip` -> `wp-scripts plugin-zip`

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`: one job on Ubuntu with Node 24 that runs `npm ci`, `npm run lint:js`, `npm run lint:css`, `npm run test:unit`, and `npm run build`. CI does not run `npm run lint:php` (it needs Composer) or `npx tsc --noEmit`; run those locally.

## Definition of "tests pass"

Before marking any feature done: `npm run build` exits 0, and `npm run lint:js`, `npm run lint:css`, `npm run lint:php`, and `npm run test:unit` exit 0, with no new browser console errors or PHP notices during a manual smoke test of the changed behavior.
