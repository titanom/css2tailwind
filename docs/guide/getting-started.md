---
outline: deep
---

# Getting Started

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher.

### Installation

::: code-group

```sh [npm]
$ npm add -D @titanom/css2tailwind
```

```sh [pnpm]
$ pnpm add -D @titanom/css2tailwind
```

```sh [yarn]
$ yarn add -D @titanom/css2tailwind
```

```sh [bun]
$ bun add -D @titanom/css2tailwind
```

:::

### Configuration

Add following scripts to your `package.json`.

```json
{
  "scripts": {
    "styles:build": "css2tailwind src/styles .styles", // [!code ++]
    "styles:watch": "css2tailwind src/styles .styles --watch" // [!code ++]
  }
}
```

::: warning
If you are type-checking `tailwind.config.ts`, make sure to build the styles beforehand.
:::

Edit your `tailwind.config.ts`.

```typescript
import plugin from 'tailwindcss/plugin.js'; // [!code ++]

import base from './.styles/base.json'; // [!code ++]
import utilities from './.styles/utilities.json'; // [!code ++]
import components from './.styles/components.json'; // [!code ++]

import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [ // [!code ++]
    plugin( // [!code ++]
      ({ addComponents, addUtilities, addBase }) => { // [!code ++]
        addBase(base); // [!code ++]
        addUtilities(utilities); // [!code ++]
        addComponents(components); // [!code ++]
      }, // [!code ++]
    ), // [!code ++]
  ], // [!code ++]
} satisfies Config;

export default config;
```

::: tip

The names and existence of the imported `.json` files depends on your [file sturcture](./file-structure) and might not be exactly the same.

:::

Exclude the output directory from source-control.

```.gitignore
.styles // [!code ++]
```

Create the styles directory.

```sh
$ mkdir src/styles
```

Create the style subdirectories.

```sh
$ mkdir src/styles/base
$ mkdir src/styles/utilities
$ mkdir src/styles/components
```

::: tip

Each of the subdirectories corresponds to a `json` file in the output directory.  
e.g.: `src/styles/base/ -> .styles/base.json`

You can create as many subdirectories inside your styles directory as you want and give them arbitrary names. Just remember to update the imports from the output directory accordingly.

If a directory does not include any files, git will not track it. To prevent this you can add an empty `.gitkeep` inside the directory.

:::
