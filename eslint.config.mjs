import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';

export default ts.config(
  { ignores: ['**/dist/', '**/node_modules/'] },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...ts.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
    },
  }
);
