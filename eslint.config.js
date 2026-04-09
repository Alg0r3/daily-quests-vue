import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import jsdoc from 'eslint-plugin-jsdoc';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginVitest from '@vitest/eslint-plugin';
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  // ---------------------------------------------------------------------------
  // Scope
  // ---------------------------------------------------------------------------
  {
    name: 'files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'],
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  // ---------------------------------------------------------------------------
  // Language Options
  // ---------------------------------------------------------------------------
  {
    name: 'language-options',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  // ---------------------------------------------------------------------------
  // Core JS Rules
  // ---------------------------------------------------------------------------
  js.configs.recommended,
  // ---------------------------------------------------------------------------
  //  Unicorn (general JS best practices)
  // ---------------------------------------------------------------------------
  pluginUnicorn.configs.recommended,
  {
    name: 'unicorn-tweaks',
    rules: {
      // In Vue, abbreviations like props/ref/ctx are idiomatic
      'unicorn/prevent-abbreviations': 'off',
      // Allow common Vue filename conventions
      'unicorn/filename-case': ['error', { cases: { pascalCase: true, kebabCase: true } }],
    },
  },
  // ---------------------------------------------------------------------------
  //  Vue Rules (strict)
  // ---------------------------------------------------------------------------
  ...pluginVue.configs['flat/strongly-recommended-error'],
  // ---------------------------------------------------------------------------
  //  Vue Accessibility Rules
  // ---------------------------------------------------------------------------
  ...pluginVueA11y.configs['flat/recommended'],
  // ---------------------------------------------------------------------------
  //  Vitest Rules
  // ---------------------------------------------------------------------------
  {
    ...pluginVitest.configs.recommended,
    files: [
      'src/**/*.{test,spec}.{js,mjs,jsx,ts,tsx}',
    ],
  },
  // ---------------------------------------------------------------------------
  //  Let Prettier handle formatting
  // ---------------------------------------------------------------------------
  skipFormatting,
  // ---------------------------------------------------------------------------
  //  JSDoc Rules
  // ---------------------------------------------------------------------------
  {
    name: 'js-documentation',
    files: [
      'src/**/repositories/*.{js,ts}',
      'src/**/stores/*.{js,ts}',
      'src/**/composables/*.{js,ts}',
      'src/**/utils/*.{js,ts}',
    ],
    plugins: { jsdoc },
    rules: {
      ...jsdoc.configs['flat/recommended'].rules,
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-throws': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'error',
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-indentation': 'warn',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-types': 'warn',
    },
  },
]);
