import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Calculation packages must be pure and deterministic: no clock, no randomness,
// no network (CLAUDE.md, "Convenciones > Cálculos"). Dates and parameters are
// always passed in as arguments.
const PURE_PACKAGES = ['core', 'legal-params', 'payroll', 'attendance', 'reports'];

export default defineConfig(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/coverage/**'] },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: PURE_PACKAGES.map((name) => `packages/${name}/src/**/*.ts`),
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Pure packages must not access the network.' },
        { name: 'XMLHttpRequest', message: 'Pure packages must not access the network.' },
        { name: 'WebSocket', message: 'Pure packages must not access the network.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Receive the date as an argument.' },
        { object: 'Math', property: 'random', message: 'Calculations must be deterministic.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Receive the date as an argument instead of reading the clock.',
        },
        {
          selector: "CallExpression[callee.name='Date']",
          message: 'Receive the date as an argument instead of reading the clock.',
        },
      ],
    },
  },
);
