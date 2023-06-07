module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  plugins: ['import', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: 'types/contentstack.d.ts',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: ['./tsconfig.json'],
      },
      rules: {
        // TODO: Add better CS API response types to lib/api.ts, then remove `any` typing from components
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
