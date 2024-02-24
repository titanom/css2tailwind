import type { Config as PluginConfig } from '@tgp/tailwind-generator-plugin';

import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require(require.resolve('@twp/tailwind-plugin'))],
} satisfies Config & PluginConfig;

export default config;
