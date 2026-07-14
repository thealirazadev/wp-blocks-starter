import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import './editor.scss';
import './style.scss';

const CALLOUT_CLASS = 'wpbs-callout';

function CalloutEdit() {
	return createElement(
		'div',
		useBlockProps( { className: CALLOUT_CLASS } ),
		createElement(
			'p',
			{},
			__( 'Callout placeholder…', 'wp-blocks-starter' )
		)
	);
}

function CalloutSave() {
	return createElement(
		'div',
		useBlockProps.save( { className: CALLOUT_CLASS } )
	);
}

registerBlockType( metadata.name, {
	...metadata,
	edit: CalloutEdit,
	save: CalloutSave,
} );
