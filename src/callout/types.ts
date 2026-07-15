export type IconName = 'info' | 'success' | 'warning' | 'tip';

export type HeadingLevel = 2 | 3 | 4;

export interface CalloutAttributes {
	heading: string;
	body: string;
	icon: IconName;
	accentColor: string;
	headingLevel: HeadingLevel;
}
