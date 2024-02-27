import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import { watch } from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

import { parseStyles, writeStyles } from './build';
import { NoStylesDirectory } from './error';
import { kinds } from './util';

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
console.debug({ argv });
const args = schema.parse(argv);

const cwd = process.cwd();
const stylesDirectory = path.join(cwd, args.stylesDirectory);
const outputDirectory = path.join(cwd, args.outputDirectory);

console.debug({ cwd });

async function assertDirExists(dir: string) {
  try {
    await fsp.stat(dir);
  } catch (error) {
    throw new NoStylesDirectory(`Styles Directory ${stylesDirectory} does not exist.`);
  }
}

async function main() {
  await assertDirExists(stylesDirectory);

  await Promise.all(
    kinds.map(async (kind) => {
      const styles = await parseStyles(path.join(stylesDirectory, kind));
      await writeStyles(outputDirectory, kind, styles);
    }),
  );

  for (const kind of kinds) {
    const kindPath = path.join(stylesDirectory, kind);
    const watcher = watch(`${kindPath}/*/*.css`, {
      awaitWriteFinish: { stabilityThreshold: 10, pollInterval: 10 },
    });
    console.debug(`${kindPath}/*/*.css`);
    watcher.on('change', () => {
      void (async () => {
        const styles = await parseStyles(path.join(stylesDirectory, kind));
        await writeStyles(outputDirectory, kind, styles);
      })();
    });
  }
}

void main();
