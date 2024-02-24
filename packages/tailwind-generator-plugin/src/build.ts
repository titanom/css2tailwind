import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import type { CssInJs } from 'postcss-js';

import { compileStyleSheet } from './compiler';

export async function readStyles(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir);
  const files = entries.map((entry) => path.join(entry, `${entry}.css`));
  return Promise.all(files.map(async (file) => await fsp.readFile(file, 'utf8')));
}

export async function parseStyles(dir: string): Promise<CssInJs> {
  const contents = await readStyles(dir);
  const compiledStyles = await Promise.all(contents.map(async (raw) => compileStyleSheet(raw)));

  return compiledStyles.reduce((kind, style) => {
    return { ...kind, ...style };
  }, {});
}
