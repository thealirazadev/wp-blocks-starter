import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import CalloutEdit from './edit';
import CalloutSave from './save';
import './editor.scss';
import './style.scss';

registerBlockType( metadata.name, {
	...metadata,
	edit: CalloutEdit,
	save: CalloutSave,
} );
