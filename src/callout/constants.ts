import { __ } from '@wordpress/i18n';

import type { HeadingLevel, IconName } from './types';

export const DEFAULT_ICON: IconName = 'info';
export const DEFAULT_HEADING_LEVEL: HeadingLevel = 2;

export const HEADING_LEVELS: HeadingLevel[] = [ 2, 3, 4 ];

export const ICON_OPTIONS: Array< { label: string; value: IconName } > = [
	{ value: 'info', label: __( 'Info', 'wp-blocks-starter' ) },
	{ value: 'success', label: __( 'Success', 'wp-blocks-starter' ) },
	{ value: 'warning', label: __( 'Warning', 'wp-blocks-starter' ) },
	{ value: 'tip', label: __( 'Tip', 'wp-blocks-starter' ) },
];

const ICON_NAMES = ICON_OPTIONS.map( ( option ) => option.value );

/**
 * Narrow an arbitrary attribute value to a known icon name.
 *
 * @param value Candidate icon attribute value.
 */
export function isValidIcon( value: unknown ): value is IconName {
	return (
		typeof value === 'string' &&
		( ICON_NAMES as string[] ).includes( value )
	);
}

/**
 * Clamp an arbitrary heading level to the supported 2-4 range.
 *
 * @param value Candidate heading-level attribute value.
 */
export function clampHeadingLevel( value: unknown ): HeadingLevel {
	const level = typeof value === 'number' ? Math.round( value ) : NaN;

	if ( ( HEADING_LEVELS as number[] ).includes( level ) ) {
		return level as HeadingLevel;
	}

	return DEFAULT_HEADING_LEVEL;
}

/**
 * Map a theme color preset slug to its CSS custom property. Accent slugs come
 * from the theme's color palette (chosen via a picker, never free text), but
 * this still guards against an empty/invalid slug reaching CSS output.
 *
 * @param slug Theme color preset slug.
 */
export function accentSlugToCSSVar( slug: string ): string | undefined {
	if ( typeof slug !== 'string' || ! /^[a-z0-9-]+$/.test( slug ) ) {
		return undefined;
	}

	return `var(--wp--preset--color--${ slug })`;
}
