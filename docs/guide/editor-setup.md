# Editor Setup

## Visual Studio Code

Add following files in the root of your project.

```jsonc
// .vscode/extensions.json
{
  "recommendations": ["bradlc.vscode-tailwindcss"]
}
```

```jsonc
// .vscode/settings.json
{
  "tailwindCSS.experimental.classRegex": [
    ["@apply[^;]*;([\\s\\S]*)}"]
  ],
  "css.customData": [".vscode/tailwind.json"]
}
```

```jsonc
// .vscode/tailwind.json
{
  "version": 1.1,
  "atDirectives": [
    {
      "name": "@tailwind",
      "description": "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#tailwind"
        }
      ]
    },
    {
      "name": "@apply",
      "description": "Use the `@apply` directive to inline any existing utility classes into your own custom CSS. This is useful when you find a common utility pattern in your HTML that you’d like to extract to a new component.",
      "references": [
        {
          "name": "Tailwind Documentation",
          "url": "https://tailwindcss.com/docs/functions-and-directives#apply"
        }
      ]
    },
  ]
}
```

## Neovim (or other LSP-based editors)

Neovim does not provide a standardized way of configuring LSP servers.  
Where and how you set these settings - you need to figure out yourself.

You can use following settings to configure [CSS Language Server](https://github.com/hrsh7th/vscode-langservers-extracted) and [TailwindCSS Language Server](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/master/packages/tailwindcss-language-server).

```lua
local lsp_settings = {
  cssls = {
    settings = {
      css = {
        lint = { unknownAtRules = 'ignore' },
      },
    },
  },
  tailwindcss = {
    settings = {
      tailwindCSS = {
        experimental = {
          classRegex = {
            { '@apply[^;]*;([^\n]*)' },
          },
        },
      },
    },
  },
}
```
