import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import { watch } from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

import { bootstrapStyles, parseStyles, writeStyles } from './build';
import { dedupeSyntaxErrors, isSyntaxError, NoStylesDirectoryError, SyntaxError } from './error';
import { isPromiseRejected, mapPromiseRejectedResultToReason, readTailwindConfig } from './util';

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
  .option('config', {
    alias: 'c',
    describe: 'Path to the tailwind configuration file',
    type: 'string',
    default: 'tailwind.config.ts',
  })
  .help()
  .alias('help', 'h');

const schema = z.object({
  stylesDirectory: z.string(),
  outputDirectory: z.string(),
  watch: z.boolean(),
  config: z.string(),
});
const args = schema.parse(argv);

const cwd = process.cwd();
const stylesDirectory = path.join(cwd, args.stylesDirectory);
const outputDirectory = path.join(cwd, args.outputDirectory);

async function assertDirExists(dir: string) {
  try {
    await fsp.stat(dir);
  } catch (error) {
    throw new NoStylesDirectoryError(`Styles Directory ${stylesDirectory} does not exist.`);
  }
}

async function main() {
  await assertDirExists(stylesDirectory);

  const tailwindConfig = await readTailwindConfig(args.config && path.join(cwd, args.config));

  const dirents = await fsp.readdir(stylesDirectory, { withFileTypes: true });
  const entries = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  const buildResult = await Promise.allSettled(
    entries.map(async (entry) => {
      await bootstrapStyles(outputDirectory, entry);
      const stylesResult = await parseStyles(
        path.join(stylesDirectory, entry),
        stylesDirectory,
        tailwindConfig,
      );

      if (stylesResult.ok) {
        await writeStyles(outputDirectory, entry, stylesResult.value);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw stylesResult.error;
      }
    }),
  );

  const buildErrors = buildResult
    .filter(isPromiseRejected)
    .flatMap(mapPromiseRejectedResultToReason);

  const syntaxErrors = dedupeSyntaxErrors(buildErrors.filter(isSyntaxError));

  for (const syntaxError of syntaxErrors) {
    console.log(syntaxError.toString());
  }

  if (!args.watch) process.exit(0);

  for (const entry of entries) {
    const entryPath = path.join(stylesDirectory, entry);
    const watcher = watch(`${entryPath}/*/*.css`, {
      awaitWriteFinish: { stabilityThreshold: 10, pollInterval: 10 },
    });
    watcher.on('change', () => {
      void (async () => {
        await bootstrapStyles(outputDirectory, entry);
        const styles = await parseStyles(
          path.join(stylesDirectory, entry),
          stylesDirectory,
          tailwindConfig,
        );
        await writeStyles(outputDirectory, entry, styles);
      })();
    });
  }
}

void main();
