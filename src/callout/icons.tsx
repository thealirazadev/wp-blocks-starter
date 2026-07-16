import { createElement } from '@wordpress/element';

import type { IconName } from './types';

/**
 * Simple single-path glyphs, sized via currentColor so they inherit the
 * accent color. Each is presentational only; the wrapping element in
 * edit/save carries aria-hidden, not the SVG itself.
 */
const ICON_PATHS: Record< IconName, string > = {
	info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2Zm0-8h-2V7h2Z',
	success:
		'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4Z',
	warning: 'M12 2 1 21h22Zm1 15h-2v-2h2Zm0-4h-2V9h2Z',
	tip: 'M9 21h6v-1H9Zm3-19a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z',
};

interface CalloutIconProps {
	name: IconName;
}

export default function CalloutIcon( { name }: CalloutIconProps ) {
	return createElement(
		'svg',
		{
			viewBox: '0 0 24 24',
			width: 24,
			height: 24,
			fill: 'currentColor',
			focusable: 'false',
			'aria-hidden': 'true',
		},
		createElement( 'path', { d: ICON_PATHS[ name ] } )
	);
}
