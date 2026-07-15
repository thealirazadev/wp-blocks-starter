import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import { createElement } from '@wordpress/element';

import metadata from './block.json';
import CalloutEdit from './edit';
import './editor.scss';
import './style.scss';

const CALLOUT_CLASS = 'wpbs-callout';

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
