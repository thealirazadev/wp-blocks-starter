import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';

import type { CalloutAttributes } from './types';

const CALLOUT_CLASS = 'wpbs-callout';

interface CalloutSaveProps {
	attributes: CalloutAttributes;
}

export default function CalloutSave( { attributes }: CalloutSaveProps ) {
	const { heading, body } = attributes;

	return createElement(
		'div',
		useBlockProps.save( { className: CALLOUT_CLASS } ),
		createElement( RichText.Content, {
			tagName: 'h2',
			className: 'wpbs-callout__heading',
			value: heading,
		} ),
		createElement( RichText.Content, {
			tagName: 'p',
			className: 'wpbs-callout__body',
			value: body,
		} )
	);
}
