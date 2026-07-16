import {
	InspectorControls,
	PanelColorSettings,
	useSettings,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ICON_OPTIONS } from './constants';
import type { CalloutAttributes } from './types';

interface ColorPaletteEntry {
	name: string;
	slug: string;
	color: string;
}

interface CalloutInspectorProps {
	attributes: CalloutAttributes;
	setAttributes: ( attributes: Partial< CalloutAttributes > ) => void;
}

export default function CalloutInspector( {
	attributes,
	setAttributes,
}: CalloutInspectorProps ) {
	const { icon, accentColor } = attributes;
	// Only the active theme's color presets are offered, so the stored value
	// stays a portable slug rather than a hardcoded hex (see docs/design.md).
	const [ palette ] = useSettings( 'color.palette' ) as [
		ColorPaletteEntry[] | undefined,
	];
	const paletteColors = palette ?? [];
	const currentEntry = paletteColors.find(
		( entry ) => entry.slug === accentColor
	);

	const handleAccentChange = ( value?: string ) => {
		const matched = paletteColors.find(
			( entry ) => entry.color === value
		);
		setAttributes( { accentColor: matched ? matched.slug : '' } );
	};

	return createElement(
		InspectorControls,
		null,
		createElement(
			PanelBody,
			{ title: __( 'Callout settings', 'wp-blocks-starter' ) },
			createElement(
				PanelRow,
				null,
				createElement( SelectControl, {
					label: __( 'Icon', 'wp-blocks-starter' ),
					value: icon,
					options: ICON_OPTIONS,
					onChange: ( value: string ) =>
						setAttributes( { icon: value as typeof icon } ),
				} )
			)
		),
		createElement( PanelColorSettings, {
			title: __( 'Color', 'wp-blocks-starter' ),
			colorSettings: [
				{
					value: currentEntry?.color,
					onChange: handleAccentChange,
					label: __( 'Accent', 'wp-blocks-starter' ),
					colors: paletteColors,
					disableCustomColors: true,
					clearable: true,
				},
			],
		} )
	);
}
