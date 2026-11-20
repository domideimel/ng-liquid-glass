import playwright from 'eslint-plugin-playwright';
import baseConfig from '../../eslint.config.mjs';

export default [
  playwright.configs['flat/recommended'],
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    rules: {
      // Helpers that wrap expect() count as assertions.
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['expectHighlighted'] }],
    },
  },
];
