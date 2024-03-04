import base from '@titanom/eslint-config/base';
import globals from '@titanom/eslint-config/globals';
import typescript from '@titanom/eslint-config/typescript';

export default [
  base,
  typescript,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
];
