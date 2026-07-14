module.exports = {
	root: true,
	ignorePatterns: [ '**/*.d.ts' ],
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended-with-formatting' ],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: [ '**/*.test.ts', '**/*.test.tsx' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
		},
	],
};
