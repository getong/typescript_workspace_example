#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Arguments {
  name: string;
  verbose: boolean;
  n?: number;
}

// Get the username from the environment if available
const defaultName = process.env.USER || process.env.USERNAME || 'World';

yargs(hideBin(process.argv))
  .scriptName('bun-cli')
  .usage('Usage: $0 <command> [options]')
  .example('$0 greet --name "John"', 'Greet John')
  .example('$0 add 2 3', 'Add 2 and 3')
  .command({
    command: 'greet',
    describe: 'Greet someone',
    builder: {
      name: {
        describe: 'Name to greet',
        demandOption: true,
        type: 'string',
        default: defaultName,
      },
      verbose: {
        describe: 'Print verbose output',
        type: 'boolean',
        default: false,
        alias: 'v',
      },
      n: {
        describe: 'Number of times to repeat greeting',
        type: 'number',
        default: 1,
      },
    },
    handler: (argv) => {
      const args = argv as unknown as Arguments;

      if (args.verbose) {
        console.log(`Preparing to greet ${args.name}`);
      }

      for (let i = 0; i < (args.n || 1); i++) {
        console.log(`Hello, ${args.name}!`);
      }
    },
  })
  .command({
    command: 'add <x> <y>',
    describe: 'Add two numbers',
    builder: {
      x: {
        describe: 'First number',
        demandOption: true,
        type: 'number',
      },
      y: {
        describe: 'Second number',
        demandOption: true,
        type: 'number',
      },
    },
    handler: (argv) => {
      console.log(`${argv.x} + ${argv.y} = ${(argv.x as number) + (argv.y as number)}`);
    },
  })
  .demandCommand(1, 'You need at least one command')
  .recommendCommands()
  .strict()
  .showHelpOnFail(true)
  .help()
  .parse();
