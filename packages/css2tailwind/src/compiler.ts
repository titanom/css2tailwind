import * as path from 'node:path';

import importPlugin from 'postcss-import';
import postcssJs, { type CssInJs } from 'postcss-js';
import nestingPlugin from 'tailwindcss/nesting';

import postcss, { type Root } from 'postcss';
import tailwindPlugin, { type Config } from 'tailwindcss';

function resolveImport(stylesDirectory: string): (id: string) => string {
  return (id: string): string => {
    const [kind, entry] = id.split('/') as [string, string];
    return path.join(stylesDirectory, kind, entry, `${entry}.css`);
  };
}

export async function compileStyleSheet(
  raw: string,
  stylesDirectory: string,
  tailwindConfig: Config,
): Promise<CssInJs> {
  const ast = postcss.parse(raw);

  const processedAst = await postcss([
    importPlugin({ resolve: resolveImport(stylesDirectory) }),
    nestingPlugin(),
    tailwindPlugin(tailwindConfig),
  ]).process(ast, {
    from: undefined,
    parser: postcss.parse,
  });

  const cssInJs = postcssJs.objectify(processedAst.root as Root);

  return cssInJs;
}
