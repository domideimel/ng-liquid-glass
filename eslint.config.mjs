import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/coverage',
      '**/ng-doc',
      '**/.cache',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/.vitest',
    ],
  },
  // Type-aware strictest presets for all TypeScript.
  ...[...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked].map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
  })),
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      // noPropertyAccessFromIndexSignature (tsconfig) requires bracket access for index signatures.
      '@typescript-eslint/dot-notation': ['error', { allowIndexSignaturePropertyAccess: true }],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$', '@ng-doc/generated'],
          depConstraints: [
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:ui'] },
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:ui'] },
            { sourceTag: 'type:e2e', onlyDependOnLibsWithTags: ['type:app'] },
          ],
        },
      ],
    },
  },
];

/** Shared Angular rules: every rule of the recommended set, template type checks and all template accessibility rules. */
export const angularStrict = [
  {
    files: ['**/*.ts'],
    rules: {
      // OnPush is the default since Angular 22: forbid opting out (Eager) and the now-redundant explicit OnPush.
      '@angular-eslint/prefer-on-push-component-change-detection': ['error', { allowExplicitOnPush: false }],
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/no-async-lifecycle-method': 'error',
      '@angular-eslint/consistent-component-styles': 'error',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',
    },
  },
  ...angular.configs.templateAccessibility.map((config) => ({ ...config, files: ['**/*.html'] })),
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'off',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/button-has-type': 'error',
      // <label lgLabel> is associated at runtime by lg-form-field; the real DOM is verified by axe ('label' rule) in every spec.
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
];
