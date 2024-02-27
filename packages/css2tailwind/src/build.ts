import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import type { CssInJs } from 'postcss-js';

import { compileStyleSheet } from './compiler';

export async function readStyles(dir: string): Promise<string[]> {
  const entries = await fsp.readdir(dir);
  const files = entries.map((entry) => path.join(dir, entry, `${entry}.css`));
  return Promise.all(files.map(async (file) => await fsp.readFile(file, 'utf8')));
}

export async function parseStyles(dir: string, tailwindConfigPath?: string): Promise<CssInJs> {
  const contents = await readStyles(dir);
  const compiledStyles = await Promise.all(
    contents.map(async (raw) => await compileStyleSheet(raw, tailwindConfigPath)),
  );

  return compiledStyles.reduce((kind, style) => {
    return { ...kind, ...style };
  }, {});
}

export async function writeStyles(dir: string, entry: string, style: CssInJs) {
  await fsp.mkdir(dir, { recursive: true });
  return fsp.writeFile(path.join(dir, `${entry}.json`), JSON.stringify(style));
}

export async function bootstrapStyles(dir: string, entry: string) {
  await fsp.mkdir(dir, { recursive: true });
  return fsp.writeFile(path.join(dir, `${entry}.json`), '{}');
}
