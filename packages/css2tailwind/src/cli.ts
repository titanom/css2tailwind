import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import { watch } from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

import { bootstrapStyles, parseStyles, writeStyles } from './build';
import { dedupeSyntaxErrors, isSyntaxError, NoStylesDirectoryError, SyntaxError } from './error';
import {
  err,
  isErr,
  isPromiseFulfilled,
  isPromiseRejected,
  mapErrResultToError,
  mapPromiseFulfilledResultToValue,
  mapPromiseRejectedResultToReason,
  ok,
  readTailwindConfig,
  Result,
} from './util';

import { Config } from 'tailwindcss';

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

function exitIf(exit: boolean, code: number) {
  if (exit) process.exit(code);
}

async function main() {
  await assertDirExists(stylesDirectory);

  const tailwindConfig = await readTailwindConfig(args.config && path.join(cwd, args.config));

  const dirents = await fsp.readdir(stylesDirectory, { withFileTypes: true });
  const entries = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  const buildResults = await Promise.all(
    entries.map(async (entry) => doTheThing(entry, tailwindConfig)),
  );

  const buildErrors = buildResults.filter(isErr).flatMap(mapErrResultToError);

  const syntaxErrors = dedupeSyntaxErrors(buildErrors.filter(isSyntaxError));

  for (const syntaxError of syntaxErrors) {
    console.log(syntaxError.toString());
  }

  exitIf(!args.watch && !!buildErrors.length, 1);

  if (!args.watch) process.exit(0);

  for (const entry of entries) {
    const entryPath = path.join(stylesDirectory, entry);
    const watcher = watch(`${entryPath}/*/*.css`, {
      awaitWriteFinish: { stabilityThreshold: 10, pollInterval: 10 },
    });
    watcher.on('change', () => {
      void (async () => {
        await doTheThing(entry, tailwindConfig);
      })();
    });
  }
}

void main();

async function doTheThing(
  entry: string,
  tailwindConfig: Config,
): Promise<Result<void, Error | SyntaxError[]>> {
  try {
    await bootstrapStyles(outputDirectory, entry);
    const stylesResult = await parseStyles(
      path.join(stylesDirectory, entry),
      stylesDirectory,
      tailwindConfig,
    );

    if (stylesResult.ok) {
      await writeStyles(outputDirectory, entry, stylesResult.value);
      return ok(undefined);
    }
    return err(stylesResult.error);
  } catch (error) {
    return err(new Error('unknown'));
  }
}
