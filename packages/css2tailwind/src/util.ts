import { bundleRequire } from 'bundle-require';

import { ResolveTailwindConfigError } from './error';

import type { Config } from 'tailwindcss';

const defaultTailwindConfig: Config = { content: ['./**/*.css'] };

// TODO: logging, error handling
export async function readTailwindConfig(path?: string): Promise<Config> {
  if (!path) return defaultTailwindConfig;
  try {
    const bundle = await bundleRequire({
      filepath: path,
      preserveTemporaryFile: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-member-access
    const config = (bundle.mod.default ?? {}) as Config;
    // TODO: log a warning
    if (Object.keys(config).length <= 0) throw new Error();
    return config;
  } catch {
    throw new ResolveTailwindConfigError(`Failed to read tailwind configuration at ${path}.`);
  }
}
