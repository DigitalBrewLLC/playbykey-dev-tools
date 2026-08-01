import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';
import astro from 'eslint-plugin-astro';

export default ts.config(
  { ignores: ['**/dist/', '**/node_modules/', '**/.astro/'] },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...ts.configs.recommended,

  // Astro recommended rules
  ...astro.configs['flat/recommended'],

  {
    languageOptions: {
      globals: globals.node,
    },
  }
);
