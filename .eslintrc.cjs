// eslint-disable-next-line no-undef
module.exports = {
	env: { browser: true, es2022: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended'
	],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	plugins: ['react-refresh'],
	rules: {
		'indent': ['error','tab',{ 'SwitchCase': 1 }],
		'linebreak-style': ['error','unix'],
		'quotes': ['error','single'],
		'semi': ['error','never'],
		'keyword-spacing': ['error',{ 'before': true, 'after': true }],
		'func-call-spacing': ['error','never'],
		'space-before-function-paren': ['error','always'],
		'eol-last': ['error','always'],
		'comma-dangle': ['error','never'],
		'no-trailing-spaces': 'error',

		'react/prop-types': 'off',
		'react-refresh/only-export-components': 'off'
	}
}
