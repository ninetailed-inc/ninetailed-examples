/**
 * Typescript-eslint: https://typescript-eslint.io/docs/linting/type-linting/
 * Airbnb: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#eslint-config-airbnbhooks
 * Airbnb Typescript: https://github.com/iamturns/eslint-config-airbnb-typescript
 *
 * */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'next/core-web-vitals', 'airbnb', 'prettier'],
  plugins: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'arrow-body-style': ['error', 'always'],
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/destructuring-assignment': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['id'],
        },
      },
    ],
    'prettier/prettier': ['error'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-typescript',
        'prettier',
      ],
      parserOptions: {
        tsconfigRootDir: '.',
        project: ['tsconfig.json'],
      },
      rules: {
        'import/no-unresolved': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
        'prettier/prettier': 'error',
      },
    },
  ],
};
