# @titanom/css2tailwind

A tool for compiling css files to CssInJs objects to be used inside tailwindcss plugins.

## Installation

```sh
pnpm add -D @titanom/css2tailwind
```

## Setup

Add following scripts to your `package.json`.

```json
{
  "scripts": {
    "styles:build": "css2tailwind src/styles .styles",
    "styles:watch": "css2tailwind src/styles .styles --watch"
  }
}
```

Edit your `tailwind.config.ts`.

```typescript
import plugin from 'tailwindcss/plugin.js';

import base from './.styles/base.json';
import utilities from './.styles/utilities.json';
import components from './.styles/components.json';

import type { Config } from 'tailwindcss';

const config = {
  plugins: [
    plugin(
      ({ addComponents, addUtilities, addBase }) => {
        addBase(base);
        addUtilities(utilities);
        addComponents(components);
      },
    ),
  ],
} satisfies Config;

export default config;
```

Edit your `.gitignore`.

```.gitignore
.styles
```

Start adding your styles.  
All styles within a directory nested in the `styles-directory` will be compiled into a json file with the same name.  
It is required to nest individual css files in a directory having the same name. This encourages colocating documentation with the corresponding styles .e.g using [storybook](https://storybook.js.org/).

```css
/* src/styles/components/button/button.css */
.button {
  &-primary {
    @apply bg-blue-400;
  }
}

/* src/styles/components/tag/tag.css */
.tag {
  @apply p-4;
}

/* src/styles/utilities/content/content.css */
.content-auto {
  content-visibility: auto;
}

.content-hidden {
  content-visibility: hidden;
}

/* src/styles/base/typography/typography.css */
h1 {
  @apply font-bold;
}
```

This will compile into the following output (formatted):

```jsonc
// .styles/components.json
{
  ".button-primary": {
    "--tw-bg-opacity": "1",
    "backgroundColor": "rgb(96 165 250 / var(--tw-bg-opacity))"
  },
  ".tag": { "padding": "1rem" }
}

// .styles/utilities.json
{
  ".content-auto": { "contentVisibility": "auto" },
  ".content-hidden": { "contentVisibility": "hidden" }
}

// .styles/base.json
{ "h1": { "fontWeight": 700 } }
```

## Usage

### CLI

```sh
$ css2tailwind --help

css2tailwind <styles-directory> <output-directory>

Positionals:
  styles-directory  path to the source styles directory                 [string]
  output-directory  path to the output file                             [string]

Options:
      --version  Show version number                                   [boolean]
  -w, --watch    Watch for file changes               [boolean] [default: false]
  -c, --config   Path to the tailwind configuration file
                                        [string] [default: "tailwind.config.ts"]
  -h, --help     Show help                                             [boolean]
```
