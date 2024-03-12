import _plugin from 'tailwindcss/plugin.js';

import base from './.styles/base.json';
import components from './.styles/components.json';
import utilities from './.styles/utilities.json';

import type { Config } from 'tailwindcss';

export const plugin = _plugin(
  ({ addComponents, addUtilities, addBase }) => {
    addComponents(components);
    addUtilities(utilities);
    addBase(base);
  },
  {
    theme: { extend: { colors: { 'my-color': '#123456' } } },
  },
);

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [plugin],
} satisfies Config;

export default config;
