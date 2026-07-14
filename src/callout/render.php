<?php
/**
 * Dynamic rendering reference for the Callout block.
 *
 * To convert this static block, add a render file reference to block.json and
 * remove its saved markup. WordPress then provides the block attributes,
 * content, and block instance to this template.
 *
 * Validate the icon against its allowlist, clamp the heading level from two to
 * four, and accept only known theme-palette slugs before rendering. Escape
 * attributes with esc_attr() and RichText content with wp_kses_post().
 *
 * @package WPBlocksStarter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
