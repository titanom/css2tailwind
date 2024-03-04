import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

import { watch, type FSWatcher } from 'chokidar';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

import { bootstrapStyles, parseStyles, writeStyles } from './build';
import {
  CloseWatcherError,
  dedupeSyntaxErrors,
  isSyntaxError,
  NoStylesDirectoryError,
  type SyntaxError,
} from './error';
import { err, isErr, mapErrResultToError, ok, readTailwindConfig, type Result } from './util';

import type { Config } from 'tailwindcss';

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

async function buildAndHandleErrors(entry: string, tailwindConfig: Config) {
  const buildResult = await compileAndWriteStyles(entry, tailwindConfig);
  if (!buildResult.ok) handleBuildErrors(buildResult.error);
  return buildResult;
}

function handleBuildErrors(error: unknown) {
  if (Array.isArray(error)) {
    const syntaxErrors = dedupeSyntaxErrors(error.filter(isSyntaxError));
    syntaxErrors.forEach((error) => console.log(error.toString()));
  }
}

function setupWatcher(entryPath: string, entry: string, tailwindConfig: Config): FSWatcher {
  const watcher = watch(`${entryPath}/*/*.css`, {
    awaitWriteFinish: { stabilityThreshold: 10, pollInterval: 10 },
  });
  watcher.on('change', () => void buildAndHandleErrors(entry, tailwindConfig));
  return watcher;
}

let watchers: FSWatcher[] = [];

function gracefullyShutdown() {
  Promise.all(watchers.map(async (watcher) => await watcher.close()))
    .then(() => process.exit(0))
    .catch(() => {
      console.error(new CloseWatcherError('').toString());
      process.exit(1);
    });
}

async function main() {
  await assertDirExists(stylesDirectory);

  const dirents = await fsp.readdir(stylesDirectory, { withFileTypes: true });
  const entries = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  await Promise.all(entries.map(async (entry) => bootstrapStyles(outputDirectory, entry)));

  const tailwindConfig = await readTailwindConfig(args.config && path.join(cwd, args.config));

  const buildResults = await Promise.all(
    entries.map(async (entry) => {
      return await buildAndHandleErrors(entry, tailwindConfig);
    }),
  );

  const buildErrors = buildResults.filter(isErr).flatMap(mapErrResultToError);

  exitIf(!args.watch && buildErrors.length > 0, 1);
  exitIf(!args.watch, 0);

  entries.forEach((entry) => {
    const entryPath = path.join(stylesDirectory, entry);
    setupWatcher(entryPath, entry, tailwindConfig);
  });

  process.on('SIGINT', gracefullyShutdown);
  process.on('SIGTERM', gracefullyShutdown);
}

void main();

async function compileAndWriteStyles(
  entry: string,
  tailwindConfig: Config,
): Promise<Result<void, Error | SyntaxError[]>> {
  try {
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
