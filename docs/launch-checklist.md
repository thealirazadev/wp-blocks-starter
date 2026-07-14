# Launch Checklist: WP Blocks Starter

Check each item before tagging a release or distributing the plugin. Unchecked means not done.

## General

- [ ] Production build committed intent verified: `npm run build` runs clean and `build/` is produced (build is gitignored; release/zip includes it).
- [ ] Debug off: no `console.log`/`console.debug` left in `src/`; `wpbs_log` only fires under `WP_DEBUG`; no `error_log` calls outside the logging helper.
- [ ] Error tracking connected: the missing-build admin notice works, and PHP notices/warnings are absent under `WP_DEBUG` on a normal post edit.
- [ ] Loading states everywhere: the editor never shows a raw error or blank block; a freshly inserted Callout shows placeholders immediately.
- [ ] 404/500 pages exist: N/A for a block plugin (WordPress/theme owns site error pages); confirmed the plugin adds no routes that could 404/500.
- [ ] Mobile checked: front-end Callout wraps and stays within the viewport on a narrow screen for all three style variations; editor usable on a small screen.

## Project-specific

- [ ] `block.json` uses `apiVersion: 3`, correct block name `wp-blocks-starter/callout`, and `textdomain: wp-blocks-starter`.
- [ ] Block round-trips: insert, save, reload produces no "invalid content" validation error; existing content with a Callout still opens cleanly.
- [ ] All three style variations (Default, Bordered, Filled) render distinctly on the front end and meet WCAG AA contrast (verified values in `docs/memory.md`).
- [ ] i18n complete: every user-facing string wrapped with the `wp-blocks-starter` text domain and `languages/wp-blocks-starter.pot` regenerated.
- [ ] Accessibility verified: semantic heading (h2 to h4), `<p>` body, `aria-hidden="true"` on the icon, visible focus on all editor controls.
- [ ] Colors/spacing/typography resolve from `theme.json` tokens on at least two block themes (no hardcoded hex/px in output).
- [ ] Plugin header metadata (name, version, requires WP, requires PHP, license MIT) is accurate; `WPBS_VERSION` matches the header and `package.json` version.
- [ ] Lockfiles committed: `package-lock.json` (and `composer.lock` if Composer used) present with exact pinned versions.
