// eslint.config.js
import js from '@eslint/js';
import astroParser from 'astro-eslint-parser';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Astro: 'readonly'
      }
    },
    plugins: {
      astro: astro
    },
    rules: {
      'astro/no-unused-css-selector': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'warn'
    }
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  },

  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'astro.config.mjs',
      'vite.config.mjs',
      'tsconfig.json',
      '**/*.config.*',
      '**/types.*'
    ]
  }
];
