declare const describe: typeof import('@jest/globals').describe;
declare const expect: typeof import('@jest/globals').expect;
declare const it: typeof import('@jest/globals').it;

declare module '@wordpress/block-editor' {
	export interface ThemeColor {
		color: string;
		name: string;
		slug: string;
	}

	export interface RichTextProps {
		allowedFormats?: string[];
		className?: string;
		onChange?: ( value: string ) => void;
		placeholder?: string;
		tagName?: string;
		value?: string;
	}

	export interface RichTextContentProps {
		className?: string;
		tagName: string;
		value?: string;
	}

	export const BlockControls: import('react').ComponentType< {
		children?: import('react').ReactNode;
	} >;
	export const HeadingLevelDropdown: import('react').ComponentType< {
		onChange: ( value: number | undefined ) => void;
		options?: number[];
		value: number;
	} >;
	export const InspectorControls: import('react').ComponentType< {
		children?: import('react').ReactNode;
	} >;
	export const PanelColorSettings: import('react').ComponentType< {
		colorSettings: Array< {
			label: string;
			onChange: ( value: string | undefined ) => void;
			value?: string;
			colors?: ThemeColor[];
			disableCustomColors?: boolean;
			clearable?: boolean;
		} >;
		colors?: ThemeColor[];
		disableCustomColors?: boolean;
		title: string;
	} >;
	export const RichText: import('react').ComponentType< RichTextProps > & {
		Content: import('react').ComponentType< RichTextContentProps >;
	};

	export function useBlockProps(
		props?: Record< string, unknown >
	): Record< string, unknown >;

	export namespace useBlockProps {
		function save(
			props?: Record< string, unknown >
		): Record< string, unknown >;
	}

	export function useSettings( ...paths: string[] ): unknown[];
}

declare module '@wordpress/blocks' {
	export function registerBlockType(
		name: string,
		settings: Record< string, unknown >
	): unknown;
}
