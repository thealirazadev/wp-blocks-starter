# Architecture: WP Blocks Starter

## App flow and architecture

WP Blocks Starter is a single WordPress plugin. There is no server backend of our own, no database, and no external services. The plugin does two things:

1. On the PHP side, it registers block types with WordPress by pointing `register_block_type` at compiled `block.json` manifests under `build/`. WordPress reads each manifest and enqueues the referenced editor script, editor style, and front-end style.
2. On the JavaScript side, the editor bundle registers the block's edit/save behavior with `registerBlockType`, and the browser renders the editing UI inside Gutenberg.

Two runtime paths exist:

- Editor (wp-admin, block editor): WordPress loads `build/callout/index.js`. The bundle calls `registerBlockType('wp-blocks-starter/callout', settings)` using metadata imported from `block.json`. The `edit` component renders the editing UI (`RichText`, `InspectorControls`, toolbar). Attributes are held in the block's own state managed by the block editor data store (`core/block-editor`); we do not create a custom store.
- Save / front end: For the Callout block we use a static `save` function. When the post is saved, Gutenberg serializes the `save` output into the post content as HTML wrapped in block comment delimiters (`<!-- wp:wp-blocks-starter/callout ... -->`). On the front end, WordPress prints that saved HTML directly and enqueues `build/callout/style-index.css`. No PHP runs per block on the front end for the static block.

### Static vs dynamic rendering

The shipped Callout block is static (attributes serialize into post content, output comes from `save`). This matches the data model: block attributes live in post content. The starter also documents the dynamic alternative so developers can copy it when a block must render server-side (for example, showing data that changes after save):

- Add `"render": "file:./render.php"` to `block.json`.
- Remove the `save` function (return `null` from `save`, i.e. omit it) so Gutenberg stores only the delimiter + attributes.
- Implement `render.php` which receives `$attributes`, `$content`, and `$block` and echoes markup. WordPress wires this up as the block's `render_callback` automatically from the manifest.

`src/callout` includes a commented `render.php` stub illustrating this pattern but the shipped block leaves it unused (no `render` key in `block.json`). This keeps the example honest while showing both patterns. See `docs/design.md` for markup details.

## Build pipeline

- `@wordpress/scripts` (wp-scripts) wraps webpack. It auto-detects every `block.json` under `src/` and produces a matching folder under `build/`.
- TypeScript and TSX compile through wp-scripts' Babel + ts-loader config; `tsconfig.json` provides type checking during lint/test but wp-scripts handles the transpile.
- SCSS files compile to CSS. `editor.scss` becomes editor-only CSS; `style.scss` becomes CSS loaded in both editor and front end.
- The DependencyExtractionWebpackPlugin (built into wp-scripts) turns `@wordpress/*` imports into runtime `wp.*` globals and writes `index.asset.php` listing script dependencies and a version hash. The PHP bootstrap relies on this file (via `register_block_type` reading `block.json`) so scripts enqueue with correct dependencies and cache-busting.

## Proposed folder / file tree

```
wp-blocks-starter/
  wp-blocks-starter.php          Plugin header, constants (WPBS_VERSION, WPBS_PLUGIN_DIR, WPBS_PLUGIN_URL), bootstrap require
  uninstall.php                  No-op cleanup (no stored options); documents the hook location
  includes/
    blocks.php                   wpbs_register_blocks(): register_block_type for each block in build/
    i18n.php                     wpbs_load_textdomain(): load_plugin_textdomain for 'wp-blocks-starter'
  src/
    callout/
      block.json                 apiVersion 3 manifest: name, attributes, supports, styles, file refs
      index.ts                   Entry: import metadata, registerBlockType with edit/save
      edit.tsx                   Editor component: useBlockProps, RichText, InspectorControls, toolbar
      save.tsx                   Static save: useBlockProps.save, RichText.Content
      controls.tsx               InspectorPanel component (icon select, accent color, heading level)
      icons.tsx                  Icon map (info/success/warning/tip) as inline SVG React elements
      types.ts                   CalloutAttributes interface, IconName union, accent slug type
      constants.ts               ICON_OPTIONS, ACCENT_PRESET_SLUGS, HEADING_LEVELS
      editor.scss                Editor-only styles (import shared partial)
      style.scss                 Shared editor + front-end styles, including the 3 style variations
      _callout.scss              Shared SCSS partial (base callout layout, tokens)
      render.php                 Commented dynamic-render stub (unused by the shipped block)
  build/                         wp-scripts output (gitignored)
  languages/
    wp-blocks-starter.pot        Translation template
  docs/
    PRD.md architecture.md rules.md design.md phases.md testing.md memory.md launch-checklist.md
  package.json
  package-lock.json              Committed lockfile
  composer.json
  composer.lock                  Committed lockfile (if composer used)
  tsconfig.json
  .eslintrc.js                   Extends @wordpress/eslint-plugin recommended + TS
  .prettierrc.js                 Re-exports @wordpress/prettier-config
  .stylelintrc.json              Extends @wordpress/scripts stylelint config
  phpcs.xml.dist                 WordPress standard ruleset, prefix + text-domain checks
  .wp-env.json                   wp-env config (maps this plugin into the container)
  .gitignore                     Ignores /build, /node_modules, /vendor
  .editorconfig
```

## Tech stack with rationale

- WordPress plugin as the delivery unit: blocks are registered by a plugin; this is the standard, theme-independent distribution.
- `block.json` with `apiVersion: 3`: the current canonical way to declare a block. Version 3 renders the editor block inside the same iframe as the front end, so editor and front-end styles match. Choosing 3 (not 1/2) is the whole point of the starter.
- `@wordpress/scripts`: the officially maintained build so we do not hand-maintain webpack/Babel. It handles block detection, dependency extraction, SCSS, and testing in one dependency.
- TypeScript + React: types catch attribute/prop mistakes early and make the example self-documenting; React is what Gutenberg uses (via `@wordpress/element`).
- `@wordpress/block-editor` / `components` / `i18n`: the supported editor primitives; using them (not raw DOM or custom UI) keeps the block consistent with core and future-proof.
- SCSS split into editor-only and shared: mirrors the `editorStyle` vs `style` distinction in `block.json`.
- Composer + PHPCS (optional): enforces WordPress Coding Standards on the small PHP surface without being required to build the block.
- `@wordpress/env`: reproducible local WordPress in Docker so contributors do not need a hand-built LAMP stack.

## Data model (entities / relationships)

There is no database. The only "entity" is the Callout block instance, whose state is its attributes, serialized into post content. Attributes (defined in `block.json`):

| Attribute      | Type   | Source            | Default    | Notes |
|----------------|--------|-------------------|------------|-------|
| `heading`      | string | html (`.wpbs-callout__heading`) | `""` | RichText inline content |
| `body`         | string | html (`.wpbs-callout__body`)    | `""` | RichText inline content |
| `headingLevel` | number | attribute         | `2`        | 2, 3, or 4 -> h2/h3/h4 |
| `icon`         | string | attribute         | `"info"`   | one of info, success, warning, tip |
| `accentColor`  | string | attribute         | `""`       | theme color preset slug (empty = theme default) |

Block style variation (Default / Bordered / Filled) is not a custom attribute; WordPress stores it as an `is-style-*` class in the block's `className`, declared via the `styles` array in `block.json`.

Relationship: one post/page contains zero or more Callout blocks in its content; there is no cross-block or cross-post relationship.

## Where state lives

- Editing state: the block editor data store (`core/block-editor`) owns the attributes while editing. The `edit` component reads `attributes` and calls `setAttributes`. We add no custom Redux store or React context.
- Persisted state: post content (the post's `post_content` in `wp_posts`), written by Gutenberg on save. This is WordPress's own storage, not ours.
- Build state: `build/` (generated, gitignored). `index.asset.php` carries the dependency + version hash used at enqueue time.

## External dependencies and required env vars

- Runtime WordPress globals provided by core: `wp.blocks`, `wp.blockEditor`, `wp.components`, `wp.element`, `wp.i18n` (imported as `@wordpress/*`, externalized at build time).
- Dev/build dependencies (npm): `@wordpress/scripts`, `@wordpress/env`, `@wordpress/block-editor`, `@wordpress/components`, `@wordpress/i18n`, `@wordpress/element`, `typescript`. Pin exact versions and commit `package-lock.json` (see `docs/rules.md`). Recommended starting versions to pin: `@wordpress/scripts@30.7.0`, `@wordpress/env@10.11.0`, `@wordpress/block-editor@14.11.0`, `@wordpress/components@29.6.0`, `@wordpress/i18n@5.11.0`, `@wordpress/element@6.11.0`, `typescript@5.7.3`. Resolve and pin whatever `npm install` locks; do not use `^`/`~` ranges in committed `package.json`.
- Dev PHP dependencies (composer, optional): `wp-coding-standards/wpcs`, `squizlabs/php_codesniffer`, `dealerdirect/phpcodesniffer-composer-installer`. Pin exact versions and commit `composer.lock`.

Environment variables: none. This project has no `.env` and no `.env.example`. wp-env reads `.wp-env.json`; local ports (default `8888`) can be overridden by a developer's personal `.wp-env.override.json`, which is not committed and holds no secrets.
