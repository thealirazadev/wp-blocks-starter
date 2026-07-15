import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { CalloutAttributes } from './types';

const CALLOUT_CLASS = 'wpbs-callout';

interface CalloutEditProps {
	attributes: CalloutAttributes;
	setAttributes: ( attributes: Partial< CalloutAttributes > ) => void;
}

export default function CalloutEdit( {
	attributes,
	setAttributes,
}: CalloutEditProps ) {
	const { heading, body } = attributes;

	return createElement(
		'div',
		useBlockProps( { className: CALLOUT_CLASS } ),
		createElement( RichText, {
			tagName: 'h2',
			className: 'wpbs-callout__heading',
			value: heading,
			onChange: ( value: string ) => setAttributes( { heading: value } ),
			placeholder: __( 'Callout heading…', 'wp-blocks-starter' ),
			allowedFormats: [ 'core/bold', 'core/italic', 'core/link' ],
		} ),
		createElement( RichText, {
			tagName: 'p',
			className: 'wpbs-callout__body',
			value: body,
			onChange: ( value: string ) => setAttributes( { body: value } ),
			placeholder: __( 'Add supporting text…', 'wp-blocks-starter' ),
		} )
	);
}
