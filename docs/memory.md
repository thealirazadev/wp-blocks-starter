# Project Memory: WP Blocks Starter

Running log of project state and decisions. Keep entries short. Log every non-obvious decision with its reason so future work does not relitigate it.

## Completed

- Planning documentation created (README, PRD, architecture, rules, design, phases, testing, memory, launch-checklist).

## In progress

- (none yet)

## Decisions log

- Shipped example block is static (attributes serialize into post content via `save`), matching the "attributes stored in post content" data model. Reason: most blocks are static and it is the simpler, clearer reference. The dynamic path (`render.php` + `render_callback` via a `block.json` `render` key) is documented and stubbed but left unused so both patterns are visible without adding server complexity to the default.
- `apiVersion: 3` chosen deliberately (not 1 or 2). Reason: v3 renders the editor block in the same iframe as the front end, so editor and front-end styles match, which is the modern-workflow lesson this starter exists to teach.
- Accent color stored as a theme color preset slug, not a raw hex, and rendered via `var(--wp--preset--color--{slug})`. Reason: keeps output theme-token-driven so the block looks correct in any theme; a hardcoded hex would break portability.
- Block style variations declared in `block.json` `styles` (declarative) rather than imperative `registerBlockStyle`. Reason: no per-variation JS preview generator is needed, so the manifest is the simplest correct place.
- Heading level constrained to h2 to h4 (no h1, no h5/h6 by default). Reason: h1 is reserved for the page title; a shallow, bounded range keeps document outlines sane. Recorded so nobody "helpfully" adds h1.
- Composer/PHPCS kept optional and separate from the JS build. Reason: the block builds and runs with npm alone; PHP standards tooling should not block a contributor who only edits TS/SCSS.
