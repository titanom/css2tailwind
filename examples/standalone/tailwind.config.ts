import plugin from 'tailwindcss/plugin.js';

import components from './.styles/components.json';

import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    plugin(
      ({ addComponents }) => {
        addComponents(components);
      },
      {
        theme: { extend: { colors: { 'my-color': '#123456' } } },
      },
    ),
  ],
} satisfies Config;

export default config;
