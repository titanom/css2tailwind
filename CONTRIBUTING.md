# Development

## Setup

Following software needs to be installed on your system:

- [pnpm](https://pnpm.io) (version 8)
- [Node.js](https://nodejs.org) (version 20)

Install dependencies:

```sh
pnpm i
```

## Architecture

This repository is a _monorepo_ powered by [pnpm workspaces](https://pnpm.io/workspaces) & [Turborepo](https://turbo.build/repo/docs).

You can find the different _projects_ in the directories:

- [./examples](./examples)
  - [./examples/standalone](./examples/standalone) contains an example for using `css2tailwind` in a single repository
- [./css2tailwind](./css2tailwind) contains the source code for the `css2tailwind` tool

## Developing

After making changes in [./css2tailwind](./css2tailwind), you must build the CLI.

```sh
pnpm -F @titanom/css2tailwind build
```

Then you can use it with any of the examples, e.g. with `standalone`.

```sh
pnpm -F @css2tw/standalone dev
```
