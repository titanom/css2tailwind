import base from '@titanom/eslint-config/base';
import react from '@titanom/eslint-config/react';
import typescript from '@titanom/eslint-config/typescript';

import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  base,
  typescript,
  react,
  {
    plugins: {
      tailwindcss: tailwindcss,
    },
    rules: {
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'warn',
    },
  },
];
