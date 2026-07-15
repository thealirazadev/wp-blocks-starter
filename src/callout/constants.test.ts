import {
	accentSlugToCSSVar,
	clampHeadingLevel,
	isValidIcon,
} from './constants';

describe( 'isValidIcon', () => {
	it( 'accepts known icon names', () => {
		expect( isValidIcon( 'success' ) ).toBe( true );
	} );

	it( 'rejects unknown or non-string values', () => {
		expect( isValidIcon( 'danger' ) ).toBe( false );
		expect( isValidIcon( undefined ) ).toBe( false );
	} );
} );

describe( 'clampHeadingLevel', () => {
	it( 'passes through allowed levels', () => {
		expect( clampHeadingLevel( 3 ) ).toBe( 3 );
	} );

	it( 'falls back to the default for out-of-range or invalid values', () => {
		expect( clampHeadingLevel( 1 ) ).toBe( 2 );
		expect( clampHeadingLevel( 6 ) ).toBe( 2 );
		expect( clampHeadingLevel( 'h3' ) ).toBe( 2 );
	} );
} );

describe( 'accentSlugToCSSVar', () => {
	it( 'maps a valid slug to a preset custom property', () => {
		expect( accentSlugToCSSVar( 'accent-1' ) ).toBe(
			'var(--wp--preset--color--accent-1)'
		);
	} );

	it( 'returns undefined for an empty or invalid slug', () => {
		expect( accentSlugToCSSVar( '' ) ).toBeUndefined();
		expect( accentSlugToCSSVar( 'Not Valid!' ) ).toBeUndefined();
	} );
} );
