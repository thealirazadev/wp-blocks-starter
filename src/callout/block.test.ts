import metadata from './block.json';

describe( 'Callout block metadata', () => {
	it( 'declares the modern block identity', () => {
		expect( metadata ).toMatchObject( {
			apiVersion: 3,
			name: 'wp-blocks-starter/callout',
			textdomain: 'wp-blocks-starter',
		} );
	} );
} );
