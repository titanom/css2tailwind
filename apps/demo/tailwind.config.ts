import plugin from 'tailwindcss/plugin';

import components from './.styles/components.json';

import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents(components);
    }),
  ],
} satisfies Config;

export default config;
