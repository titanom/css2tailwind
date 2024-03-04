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

Exclude the output directory from source-control.

```.gitignore
.styles // [!code ++]
```

Create the styles directory.

```sh
$ mkdir src/styles
```
