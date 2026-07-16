import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';

import { accentSlugToCSSVar } from './constants';
import CalloutIcon from './icons';
import type { CalloutAttributes } from './types';

const CALLOUT_CLASS = 'wpbs-callout';

interface CalloutSaveProps {
	attributes: CalloutAttributes;
}

export default function CalloutSave( { attributes }: CalloutSaveProps ) {
	const { heading, body, icon, accentColor, headingLevel } = attributes;
	const accentVar = accentSlugToCSSVar( accentColor );

	return createElement(
		'div',
		useBlockProps.save( {
			className: `${ CALLOUT_CLASS } ${ CALLOUT_CLASS }--icon-${ icon }`,
			style: accentVar
				? ( { '--wpbs-callout-accent': accentVar } as Record<
						string,
						string
				  > )
				: undefined,
		} ),
		createElement( CalloutIcon, {
			name: icon,
			className: 'wpbs-callout__icon',
		} ),
		createElement(
			'div',
			{ className: 'wpbs-callout__content' },
			createElement( RichText.Content, {
				tagName: `h${ headingLevel }`,
				className: 'wpbs-callout__heading',
				value: heading,
			} ),
			createElement( RichText.Content, {
				tagName: 'p',
				className: 'wpbs-callout__body',
				value: body,
			} )
		)
	);
}
