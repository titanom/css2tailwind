import type { Config as PluginConfig } from '@tgp/tailwind-generator-plugin';

import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require(require.resolve('@tgp/tailwind-generator-plugin'))],
  pluginGenerator: { stylesDirectory: 'styles' },
} satisfies Config & PluginConfig;

export default config;
