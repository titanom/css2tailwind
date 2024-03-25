# Monorepo

If your project is using a monorepo and you want to separate you styles into a package, you must adapt the configuration accordingly.

```
.
├─ app
│  ├─ tailwind.config.ts
│  └─ package.json
└─ ui
   ├─ styles
   │  └─ ...
   ├─ tailwind.config.ts
   └─ package.json
```

```typescript
// ui/tailwind.config.ts
import _plugin from 'tailwindcss/plugin.js';

import base from './.styles/base.json';
import utilities from './.styles/utilities.json';
import components from './.styles/components.json';

import type { Config } from 'tailwindcss';

export const plugin = _plugin(
  ({ addComponents, addUtilities, addBase }) => {
    addBase(base);
    addUtilities(utilities);
    addComponents(components);
  },
)

const config = {
  content: ['./styles/**/*.css'],
  plugins: [plugin],
} satisfies Config;

export default config;
```

```typescript
// app/tailwind.config.ts
import type { Config } from 'tailwindcss';

// This must be a relative import to allow HMR of the styles
import { plugin } from '../ui/tailwind.config'; // [!code ++]

const config = {
  plugins: [plugin], // [!code ++]
} satisfies Config;

export default config;
```

::: tip

For a full example see [examples/monorepo](https://github.com/titanom/css2tailwind/tree/master/examples/monorepo).

:::
