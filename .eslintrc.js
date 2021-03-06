module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        argsIgnorePattern: '^_',
      },
    ],
    'no-console': [
      2,
      {
        allow: ['warn', 'error'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: { browser: true, node: true, es6: true },
  ignorePatterns: ['**/_documant.tsx'],
}
