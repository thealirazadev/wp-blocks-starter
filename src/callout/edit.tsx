import {
	BlockControls,
	HeadingLevelDropdown,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	accentSlugToCSSVar,
	clampHeadingLevel,
	HEADING_LEVELS,
} from './constants';
import CalloutInspector from './controls';
import CalloutIcon from './icons';
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
	const { heading, body, icon, accentColor, headingLevel } = attributes;
	const accentVar = accentSlugToCSSVar( accentColor );

	return createElement(
		'div',
		useBlockProps( {
			className: `${ CALLOUT_CLASS } ${ CALLOUT_CLASS }--icon-${ icon }`,
			style: accentVar
				? ( { '--wpbs-callout-accent': accentVar } as Record<
						string,
						string
				  > )
				: undefined,
		} ),
		createElement(
			BlockControls,
			null,
			createElement(
				ToolbarGroup,
				null,
				createElement( HeadingLevelDropdown, {
					options: HEADING_LEVELS,
					value: headingLevel,
					onChange: ( value: number | undefined ) =>
						setAttributes( {
							headingLevel: clampHeadingLevel( value ),
						} ),
				} )
			)
		),
		createElement( CalloutInspector, { attributes, setAttributes } ),
		createElement( CalloutIcon, {
			name: icon,
			className: 'wpbs-callout__icon',
		} ),
		createElement(
			'div',
			{ className: 'wpbs-callout__content' },
			createElement( RichText, {
				tagName: `h${ headingLevel }`,
				className: 'wpbs-callout__heading',
				value: heading,
				onChange: ( value: string ) =>
					setAttributes( { heading: value } ),
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
		)
	);
}
