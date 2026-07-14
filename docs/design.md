# Design: WP Blocks Starter (Callout block)

This document specifies the editor experience and the rendered output for the `wp-blocks-starter/callout` block. It covers editor controls, style variations, the color/spacing/typography approach, component states, and accessibility. It is UI-focused; data and build details are in `docs/architecture.md`.

## Anatomy of the rendered block

```
.wpbs-callout  (root; useBlockProps wrapper; also carries is-style-* and wpbs-callout--icon-{icon})
  .wpbs-callout__icon      decorative icon, aria-hidden="true", inline SVG, currentColor-driven
  .wpbs-callout__content
    <h2|h3|h4 class="wpbs-callout__heading">   heading text (RichText)
    <p class="wpbs-callout__body">             body text (RichText)
```

The heading tag is `h2`, `h3`, or `h4` depending on `headingLevel`. The accent (left border and icon color) is driven by the `accentColor` preset slug; when empty, it falls back to a theme-derived default.

## Editor controls

### Inline (canvas)

- Heading: `RichText` with `tagName={ 'h' + headingLevel }`, `placeholder={ __( 'Callout heading…', 'wp-blocks-starter' ) }`, allowed inline formats limited to bold/italic/link.
- Body: `RichText` with `tagName="p"`, `placeholder={ __( 'Add supporting text…', 'wp-blocks-starter' ) }`, standard inline formats.
- Both use `useBlockProps` on the root so the selected/hover chrome and alignment behave like core blocks.

### Block toolbar (`BlockControls`)

- A heading-level control: reuse `HeadingLevelDropdown` from `@wordpress/block-editor` if available in the pinned version; otherwise a `ToolbarGroup` with buttons for H2/H3/H4. Selecting a level sets `headingLevel`. This mirrors how the core Heading block exposes levels and is discoverable where users expect it.

### Sidebar (`InspectorControls`)

One `PanelBody title={ __( 'Callout settings', 'wp-blocks-starter' ) }` containing:

- Icon: `SelectControl` (or `ToggleGroupControl`) labeled "Icon", options Info / Success / Warning / Tip mapping to `icon` values `info` / `success` / `warning` / `tip`. Changing it swaps the SVG and the `wpbs-callout--icon-{icon}` modifier class.
- Accent color: color selection sourced from the theme palette. Use `PanelColorSettings` or the color panel via `useSettings( 'color.palette' )` so only theme presets are offered. Store the chosen preset slug in `accentColor` (not a raw hex), so the output stays theme-token-driven. A "clear" action resets to `""` (theme default).
- Heading level (if not shown only in the toolbar): a `ToggleGroupControl` H2/H3/H4 kept in sync with the toolbar control.

Controls are grouped in a single panel to keep the example legible; do not add a second panel until a real third group of settings exists (rule of three).

## Block style variations

Declared in `block.json` under `styles` (declarative, the modern approach), not via imperative `registerBlockStyle` unless a variation needs a preview generator:

- `default` (label "Default", `isDefault: true`): left accent border, transparent/surface background.
- `bordered` (label "Bordered"): full 1px border in the accent color, no fill.
- `filled` (label "Filled"): tinted background derived from the accent token, stronger icon emphasis.

WordPress applies the choice as an `is-style-default` / `is-style-bordered` / `is-style-filled` class on the root. The three variations are implemented purely in `style.scss` targeting those classes. Each variation must keep AA contrast (see Accessibility). Variations are visible and switchable from the editor Styles panel and persist to saved content.

## Color, spacing, and typography approach

Prefer `theme.json` tokens over hardcoded values everywhere:

- Color: the accent is a theme color preset. Output references `var(--wp--preset--color--{accentColor})`; when `accentColor` is empty, fall back to `currentColor` / a neutral token so the block still looks intentional under any theme. Background/text for the block use the `supports.color` machinery (WordPress emits preset-backed inline styles/classes). Never ship a hardcoded brand hex in component logic.
- Spacing: padding and gaps use spacing presets via `supports.spacing` (`padding`, `margin`) and `var(--wp--preset--spacing--{slug})` in SCSS where a preset applies. The internal gap between icon and content uses a spacing token, not a magic pixel value.
- Typography: inherit the theme's font family and scale. The heading uses the theme's heading styling for its level; the body inherits body typography. Do not set custom font sizes in the block unless exposed through `supports.typography` and chosen by the user.

Rationale: a starter must look correct in any well-built theme without edits. Binding to `theme.json` tokens is what makes the example portable and is a core lesson of the modern workflow.

## Component states

- Empty (just inserted): both RichText fields show placeholder text; the default icon (Info) and default style render; no accent border color beyond the neutral fallback until a color is chosen. The block is still selectable and visually coherent.
- Filled: heading and body show authored content.
- Selected: standard block selection outline from `useBlockProps`; inspector panel available.
- Focused control: every inspector/toolbar control shows the WordPress focus ring (do not suppress `outline`).
- Long content: long headings wrap; long body text wraps and the layout does not overflow horizontally. Icon stays top-aligned with the first line of the heading.
- Front end: identical structure to the editor (apiVersion 3 renders the editor inside an iframe sharing `style.css`), so the editor preview matches the published result.

## Accessibility of the rendered block

- Semantic markup: the heading is a real `h2`/`h3`/`h4`, the body is a `<p>`. The container is a `<div>`; do not use a heading or list where a div belongs.
- Heading levels: authors choose h2 to h4 so the callout fits the surrounding document outline. We deliberately do not allow h1 (reserved for the page/post title) or skipping below h4. Document this constraint in the control's help text.
- Decorative icon: the icon is presentational and carries `aria-hidden="true"`; it must not be the only means of conveying meaning. Meaning comes from the heading/body text, not the icon alone.
- Contrast: default palette combinations for each style variation must meet WCAG AA (4.5:1 for body text, 3:1 for large heading text and for the border/icon against the background). The Filled variation's tinted background must be verified against the body text token. Note results in `docs/memory.md`.
- Focus: editor controls keep visible focus states. On the front end the block is static content with no interactive controls of its own; any links inside RichText inherit the theme's focus styling.
- Motion/color independence: no animation; information is never conveyed by color alone (icon + text carry the message; color is emphasis only).

## Icons

Four inline SVG icons (`info`, `success`, `warning`, `tip`) live in `icons.tsx` as React elements sized via `currentColor` so they inherit the accent color. They are simple, single-path glyphs (no external icon font, no Dashicons dependency on the front end). Each SVG sets `focusable="false"` and is wrapped by an element with `aria-hidden="true"`.
