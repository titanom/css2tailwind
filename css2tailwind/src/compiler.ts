import * as fs from 'node:fs';
import * as path from 'node:path';

import importPlugin from 'postcss-import';
import postcssJs, { type CssInJs } from 'postcss-js';
import nestingPlugin from 'tailwindcss/nesting';

import { ResolveImportError, SyntaxError } from './error';

import postcss, { CssSyntaxError, type Root } from 'postcss';
import tailwindPlugin, { type Config } from 'tailwindcss';

function resolveImport(stylesDirectory: string, exitOnError: boolean): (id: string) => string {
  return (id: string): string => {
    const [kind, entry] = id.split('/') as [string, string];
    try {
      if (!(kind && entry)) throw new ResolveImportError(id);
      const resolvedPath = path.join(stylesDirectory, kind, entry, `${entry}.css`);
      if (!fs.existsSync(resolvedPath)) throw new ResolveImportError(id);
      return resolvedPath;
    } catch (error) {
      if (error instanceof ResolveImportError) {
        console.error(error.toString());
      }

      exitOnError && process.exit(1);
      throw error;
    }
  };
}

export async function compileStyleSheet(
  raw: string,
  stylesDirectory: string,
  tailwindConfig: Config,
  exitOnUnresolvedImport: boolean = false,
): Promise<CssInJs> {
  try {
    const ast = postcss.parse(raw);
    const processedAst = await postcss([
      importPlugin({ resolve: resolveImport(stylesDirectory, exitOnUnresolvedImport) }),
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
