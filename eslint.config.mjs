import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const config = [
  ...nextVitals,
  ...nextTs,

  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**', 'next-env.d.ts'],
  },

  {
    plugins: {
      boundaries,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },

    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'app/*' },
        { type: 'pages', pattern: 'pages/*' },
        { type: 'widgets', pattern: 'widgets/*' },
        { type: 'features', pattern: 'features/*' },
        { type: 'entities', pattern: 'entities/*' },
        { type: 'shared', pattern: 'shared/*' },
      ],
    },

    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      '@next/next/no-img-element': 'warn',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['*'] },
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },

  prettier,
];

export default config;
