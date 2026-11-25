# Design decisions

## 1. Blocks are registered from their compiled `block.json`

`src/callout/block.json` is the single source of the block's identity, attributes, assets, supports and style variations. The PHP side does not list blocks: `wpbs_register_blocks()` globs `build/*/block.json` and calls `register_block_type()` on each directory, so adding a block means adding a folder under `src/`, not editing PHP. In the editor, `index.ts` spreads the same manifest into `registerBlockType()` and adds only `edit` and `save`. Registration failures (missing `build/`, no manifests, a `WP_Error`, a thrown exception) are logged through the debug-only `wpbs_log()` and produce a single admin notice telling an administrator to run `npm run build`, instead of a fatal error or a silently missing block.

## 2. `apiVersion: 3`

Version 3 renders the block inside the editor iframe, the same document model as the front end, so the editor canvas and the published page share one stylesheet and look the same. That is the main reason to start from this workflow rather than an older block API, and it is why the base layout lives in one shared SCSS partial (`_callout.scss`) loaded through `style.scss`, which `block.json` applies in both places.

## 3. The example block is static, with the dynamic path documented

The Callout serializes its markup in `save.tsx`, and its `heading` and `body` attributes are sourced from that HTML with `source: html` selectors, so the content lives in post content and needs no server rendering. Most blocks are static, and it is the simpler reference to copy. `src/callout/render.php` is a commented stub that explains how to convert the block to dynamic rendering (add a `render` reference to `block.json`, drop the saved markup, validate and escape the attributes) without adding server code to the default block.

## 4. Edit and save share one set of guards

`constants.ts` holds the allowlists and normalizers used by both `edit.tsx` and `save.tsx`: `isValidIcon()` narrows the icon to `info`, `success`, `warning` or `tip`, `clampHeadingLevel()` maps anything outside 2 to 4 back to 2, and `accentSlugToCSSVar()` turns a slug into `var(--wp--preset--color--<slug>)` only when it matches `^[a-z0-9-]+$`. Because both sides normalize the same way, a corrupted or hand-edited attribute renders a sane default rather than broken markup, and edit and save cannot drift into producing different HTML, which is what triggers block validation errors. `CalloutAttributes` in `types.ts` types the attribute shape for both components. These functions are the unit-tested surface.

## 5. Headings are limited to h2 through h4

The page title already owns `h1`, and a shallow, bounded range keeps document outlines sensible. The toolbar uses core's `HeadingLevelDropdown` with `HEADING_LEVELS = [ 2, 3, 4 ]`, and its value passes through the same `clampHeadingLevel()` used for validation.

## 6. The accent color is stored as a theme preset slug

The inspector's `PanelColorSettings` offers only the active theme's `color.palette` (custom colors disabled, clearable), and the chosen color is stored as its slug, not a hex value. The block sets `--wpbs-callout-accent` to the preset's CSS custom property, and `_callout.scss` resolves it with a fallback to `--wp--preset--color--contrast` and then `currentColor`, so an empty accent still looks intentional and the block follows whatever palette the active theme defines. A stored hex would break as soon as the theme changed.

## 7. Style variations are declared in the manifest and kept contrast-safe

Default, Bordered and Filled are listed in `block.json` `styles` rather than registered with `registerBlockStyle()`, because no per-variation script is needed. Bordered draws a 1px accent outline; Filled adds a 12% accent tint with `color-mix( in srgb, ... 12%, transparent )` and a larger icon. Neither variation changes the text color, which stays under the block's `supports.color` setting, so the tint cannot reduce body-text contrast. The accent only colors the border and the 24px (28px on Filled) icon, which are graphical elements rather than text. `color-mix()` is supported in all current evergreen browsers, so there is no fallback.

## 8. Styling comes from `theme.json` tokens

Spacing uses `--wp--preset--spacing--*` with plain fallbacks, colors use preset custom properties, and fonts are inherited, so the block adapts to the theme instead of carrying its own design system. Class names follow BEM under the `wpbs-callout` root. The WordPress stylelint config only allows kebab-case, which rejects BEM `__` and `--`, so `.stylelintrc.json` overrides `selector-class-pattern` to allow `wpbs-` BEM classes and core `is-style-*` classes and nothing else.

## 9. Icons are decorative inline SVGs

The four icons are single-path SVGs drawn with `fill: currentColor`, so they take the accent color from CSS, and each carries `aria-hidden="true"` and `focusable="false"` because the heading and body already convey the meaning. Focus styles are never overridden, so every control keeps the WordPress default focus ring.

## 10. TypeScript with a small hand-written type shim

The editor code is TypeScript because the block attribute contract is easy to get wrong between `edit` and `save`. Several `@wordpress/*` packages ship no bundled types, so `src/wordpress.d.ts` declares only the shapes this block uses (for example the per-item `colorSettings` of `PanelColorSettings`). ESLint extends `plugin:@wordpress/eslint-plugin/recommended`, not `recommended-with-formatting`: only `recommended` adds the TypeScript parser and import-resolver override, and without it ESLint failed on `.tsx` files and on extensionless imports such as `./edit`.

## 11. Translations are extracted from the compiled bundle

Every editor string is wrapped in `__( ..., 'wp-blocks-starter' )`, and `block.json` metadata (title, description, keywords, style labels) is extracted by WordPress tooling directly from the manifest. WP-CLI's JavaScript extractor cannot parse TypeScript, so `languages/wp-blocks-starter.pot` is built by running `wp i18n make-pot` over the plugin root for PHP and `block.json` strings, then over `build/` with `--skip-php --skip-block-json` for the compiled script strings, and merging the two.

## 12. PHP tooling is optional, and the plugin stores nothing

The block builds and runs with npm alone; Composer and PHPCS are only needed to lint the PHP, so a contributor who only edits TypeScript or SCSS is not blocked by PHP tooling. The plugin writes no options, meta or tables, so `uninstall.php` has nothing to remove.
