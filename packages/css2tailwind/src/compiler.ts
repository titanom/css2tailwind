import { bundleRequire } from 'bundle-require';
import postcssJs, { type CssInJs } from 'postcss-js';
import nestingPlugin from 'tailwindcss/nesting';

import postcss, { type Root } from 'postcss';
import type { Config } from 'tailwindcss';
import tailwindPlugin from 'tailwindcss';

const defaultTailwindConfig: Config = { content: ['./**/*.css'] };

async function readTailwindConfig(path?: string): Promise<Config> {
  if (!path) return defaultTailwindConfig;
  const bundle = await bundleRequire({
    filepath: path,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-member-access
  const config = (bundle.mod.default ?? {}) as Config;
  // TODO: log a warning
  if (Object.keys(config).length <= 0) return defaultTailwindConfig;
  return config;
}

export async function compileStyleSheet(
  raw: string,
  tailwindConfigPath?: string,
): Promise<CssInJs> {
  const ast = postcss.parse(raw);

  const processedAst = await postcss([
    nestingPlugin(),
    tailwindPlugin(await readTailwindConfig(tailwindConfigPath)),
  ]).process(ast, {
    from: undefined,
    parser: postcss.parse,
  });

  const cssInJs = postcssJs.objectify(processedAst.root as Root);

  return cssInJs;
}
