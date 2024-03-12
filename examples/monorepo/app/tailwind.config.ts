import { plugin } from '../ui/tailwind.config';

import type { Config } from 'tailwindcss';

const config = {
  content: ['./src/index.html', './src/**/*.tsx'],
  plugins: [plugin],
} satisfies Config;

export default config;
