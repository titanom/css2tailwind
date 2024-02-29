import * as path from 'node:path';

import importPlugin from 'postcss-import';
import postcssJs, { type CssInJs } from 'postcss-js';
import nestingPlugin from 'tailwindcss/nesting';

import { SyntaxError } from './error';

import postcss, { CssSyntaxError, type Root } from 'postcss';
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
  try {
    const ast = postcss.parse(raw);
    const processedAst = await postcss([
      importPlugin({ resolve: resolveImport(stylesDirectory) }),
      nestingPlugin(),
      tailwindPlugin(tailwindConfig),
    ]).process(ast, {
      // TODO: this should always be set
      from: undefined,
      parser: postcss.parse,
    });

    const cssInJs = postcssJs.objectify(processedAst.root as Root);

    return cssInJs;
  } catch (error) {
    if (error instanceof CssSyntaxError) {
      throw new SyntaxError(error);
    }

    // TODO: are there any other errors?
    throw new Error('unknown error');
  }
}
