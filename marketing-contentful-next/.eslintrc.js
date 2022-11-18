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
      // TODO: These 'warn's are bandaids. Fix components/HubspotForm.tsx
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/restrict-template-expressions': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/no-floating-promises': 'warn',
        '@typescript-eslint/restrict-plus-operands': 'warn',
        '@typescript-eslint/naming-convention': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        'import/no-unresolved': 'error',
        'prettier/prettier': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: false },
        ],
      },
    },
  ],
};
