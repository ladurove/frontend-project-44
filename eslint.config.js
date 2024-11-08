/* eslint-disable */
import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTSEslint from 'typescript-eslint';
// import pluginImport from 'eslint-plugin-import';
import { FlatCompat } from '@eslint/eslintrc';
import path from "path";
import {fileURLToPath} from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

/** @type { import("eslint").Linter.Config[] } */
export default [
  ...compat.plugins('eslint-plugin-import'),
  ...pluginTSEslint.configs.recommended,
  pluginJs.configs.recommended,
  {languageOptions: { globals: globals.node }},
  {
    plugins: {
      pluginTSEslint,
    },
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/extensions': [
        'error',
        {
          js: 'always',
          ts: 'always',
        },
      ],
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'no-console': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
