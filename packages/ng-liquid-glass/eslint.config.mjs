import nx from '@nx/eslint-plugin';
import baseConfig, { angularStrict } from '../../eslint.config.mjs';

export default [
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  ...baseConfig,
  ...angularStrict,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}', '{projectRoot}/**/*.spec.ts', '{projectRoot}/test/**/*'],
          // Tailwind is consumed through styles/theme.css, not imported from TypeScript. The ng-add schematic runs
          // inside the consumer's Angular CLI, which provides the schematics packages (as with Angular Material).
          ignoredDependencies: ['tailwindcss', '@angular-devkit/schematics', '@schematics/angular'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lg',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lg',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
