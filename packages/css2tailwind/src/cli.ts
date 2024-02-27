import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import { watch } from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

import { parseStyles, writeStyles } from './build';
import { NoStylesDirectory } from './error';

const { argv } = yargs(hideBin(process.argv))
  .usage('tgp <styles-directory> <output-directory>')
  .command('$0 <styles-directory> <output-directory>', 'The main command', (yargs) => {
    yargs
      .positional('styles-directory', {
        describe: 'path to the source styles directory',
        type: 'string',
      })
      .positional('output-directory', {
        describe: 'path to the output file',
        type: 'string',
      });
  })
  .option('watch', {
    alias: 'w',
    describe: 'Watch for file changes',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h');

const schema = z.object({
  stylesDirectory: z.string(),
  outputDirectory: z.string(),
  watch: z.boolean(),
});
const args = schema.parse(argv);

const cwd = process.cwd();
const stylesDirectory = path.join(cwd, args.stylesDirectory);
const outputDirectory = path.join(cwd, args.outputDirectory);

async function assertDirExists(dir: string) {
  try {
    await fsp.stat(dir);
  } catch (error) {
    throw new NoStylesDirectory(`Styles Directory ${stylesDirectory} does not exist.`);
  }
}

async function main() {
  await assertDirExists(stylesDirectory);

  const dirents = await fsp.readdir(stylesDirectory, { withFileTypes: true });
  const entries = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  await Promise.all(
    entries.map(async (entry) => {
      const styles = await parseStyles(path.join(stylesDirectory, entry));
      await writeStyles(outputDirectory, entry, styles);
    }),
  );

  if (!args.watch) process.exit(0);

  for (const entry of entries) {
    const entryPath = path.join(stylesDirectory, entry);
    const watcher = watch(`${entryPath}/*/*.css`, {
      awaitWriteFinish: { stabilityThreshold: 10, pollInterval: 10 },
    });
    watcher.on('change', () => {
      void (async () => {
        const styles = await parseStyles(path.join(stylesDirectory, entry));
        await writeStyles(outputDirectory, entry, styles);
      })();
    });
  }
}

void main();