import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import type { CssInJs } from 'postcss-js';

import { compileStyleSheet } from './compiler';
import { isSyntaxError, type SyntaxError } from './error';
import { err, isPromiseFulfilled, mapPromiseFulfilledResultToValue, ok, type Result } from './util';

import type { Config } from 'tailwindcss';

export async function readStyles(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir);
  const files = entries.map((entry) => path.join(dir, entry, `${entry}.css`));
  return Promise.all(files.map(async (file) => await fsp.readFile(file, 'utf8')));
}

export async function parseStyles(
  dir: string,
  stylesDirectory: string,
  tailwindConfig: Config,
  exitOnUnresolvedImport: boolean,
): Promise<Result<CssInJs, SyntaxError[] | Error>> {
  const contents = await readStyles(dir);
  try {
    const compiledStyleResults = await Promise.allSettled(
      contents.map(
        async (raw) =>
          await compileStyleSheet(raw, stylesDirectory, tailwindConfig, exitOnUnresolvedImport),
      ),
    );

    const errors = compiledStyleResults
      .filter(function (result): result is PromiseRejectedResult {
        return result.status === 'rejected';
      })
      .map((result) => result.reason as unknown);

    if (errors.length) {
      const syntaxErrors = errors.filter(isSyntaxError);

      return err(syntaxErrors);
    }

    const values = compiledStyleResults
      .filter(isPromiseFulfilled)
      .map(mapPromiseFulfilledResultToValue);

    return ok(
      values.reduce((kind, style) => {
        return { ...kind, ...style };
      }, {}),
    );
  } catch (error) {
    return err(new Error('unknown'));
  }
}

export async function writeStyles(dir: string, entry: string, style: CssInJs) {
  await fsp.mkdir(dir, { recursive: true });
  return fsp.writeFile(path.join(dir, `${entry}.json`), JSON.stringify(style));
}

export async function bootstrapStyles(dir: string, entry: string) {
  await fsp.mkdir(dir, { recursive: true });
  return fsp.writeFile(path.join(dir, `${entry}.json`), '{}');
}
