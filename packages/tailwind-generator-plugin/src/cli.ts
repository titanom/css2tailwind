import * as path from 'node:path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { z } from 'zod';

const { argv } = yargs(hideBin(process.argv))
  .usage('tgp <styles-directory>')
  .command('$0 <styles-directory>', 'The main command', (yargs) => {
    yargs.positional('styles-directory', {
      describe: 'path to the source styles directory',
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

const schema = z.object({ stylesDirectory: z.string() });
const args = schema.parse(argv);

const cwd = process.cwd();
const stylesDirectory = path.join(cwd, args.stylesDirectory);

console.debug({ stylesDirectory });
