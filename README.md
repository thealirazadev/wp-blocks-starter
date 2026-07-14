# WP Blocks Starter

WP Blocks Starter is a WordPress plugin boilerplate for building modern Gutenberg blocks with the current block workflow: a `block.json` manifest (`apiVersion: 3`), a `@wordpress/scripts` build pipeline, and a TypeScript + React editor. It ships one fully working example block, `wp-blocks-starter/callout`, a highlighted callout with an editable heading, editable body text, a selectable icon, a theme-driven accent color, and registered block style variations. The Callout block is the copy-this pattern: to add a new block, duplicate `src/callout`, rename it, and adjust the manifest and components.

## Features

- Example `Callout` block with editable heading and body (RichText), selectable icon, theme-palette accent color, and adjustable heading level (h2 to h4).
- Three registered block style variations: Default, Bordered, Filled.
- `InspectorControls` sidebar panel and a block toolbar heading-level control.
- `block.json` manifest with `apiVersion: 3`, declarative styles, and `supports` for spacing and color.
- Static save output with attributes stored in post content; a documented dynamic `render.php` pattern for blocks that need server rendering.
- Colors, spacing, and typography sourced from `theme.json` preset tokens (CSS custom properties) rather than hardcoded values.
- `@wordpress/scripts` build tooling, TypeScript, SCSS for editor and frontend styles, and `@wordpress/i18n` translation with a text domain.
- Linting and formatting for JS/TS (`@wordpress/eslint-plugin`, Prettier), SCSS (stylelint), and PHP (PHPCS with the WordPress standard).
- Local development environment via `@wordpress/env` (wp-env).

## Tech stack

- WordPress plugin (PHP bootstrap, block registration via `register_block_type` reading `block.json`).
- PHP 8.0+ following the WordPress Coding Standards, prefix `wpbs_` / `WPBS_`, text domain `wp-blocks-starter`.
- JavaScript + TypeScript + React editor using `@wordpress/block-editor`, `@wordpress/components`, `@wordpress/i18n`, `@wordpress/element`.
- Build tooling: `@wordpress/scripts` (webpack + Babel + the dependency-extraction plugin).
- SCSS compiled to `editor.css` (editor only) and `style.css` (editor and frontend).
- Node/npm for the build; Composer (optional) for PHP autoloading and PHPCS.
- `@wordpress/env` for a local WordPress instance.

## Prerequisites

- Node.js 20 LTS or newer and npm 10+.
- PHP 8.0+ (only needed for PHPCS; WordPress itself runs inside wp-env).
- Docker Desktop (required by `@wordpress/env`).
- Composer 2.x (optional; only for PHP autoloading and PHPCS).
- A WordPress 6.6+ target (the version wp-env provisions by default).

## Install

```bash
npm install
composer install   # optional: PHP autoloading and PHPCS tooling
```

## Run and build

```bash
npm start           # wp-scripts start: watch mode, rebuilds src/ into build/ on change
npm run build       # wp-scripts build: production bundle written to build/
npm run env:start   # start the local WordPress site (http://localhost:8888)
npm run env:stop    # stop the local WordPress site
```

The plugin loads compiled blocks from `build/`. Run `npm run build` (or `npm start`) at least once before activating the plugin, then activate "WP Blocks Starter" in `wp-admin`.

## Test

```bash
npm run lint:js     # ESLint over src/
npm run lint:css    # stylelint over src/ SCSS
npm run lint:php    # PHPCS over PHP files (requires composer install)
npm run test:unit   # Jest unit tests (wp-scripts test-unit-js)
npm run test:e2e    # Playwright end-to-end tests (requires env:start)
```

`npm run build` and the lint + unit tests must pass before any feature is considered done. See `docs/testing.md`.

## Project structure

```
wp-blocks-starter/
  wp-blocks-starter.php     Plugin bootstrap: constants, block registration
  includes/                 PHP helpers (block registration, i18n loading)
  src/callout/              The example block source (block.json, TS/TSX, SCSS)
  build/                    Compiled output from wp-scripts (gitignored)
  languages/                Translation template (.pot)
  docs/                     Planning and handoff documentation
  package.json / composer.json / tsconfig.json / phpcs.xml.dist
```

See `docs/architecture.md` for the full tree and rationale, and `docs/phases.md` for the build order.

## License

License: MIT
