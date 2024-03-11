# File Structure

All custom CSS files are located inside the `styles-directory` (commonly `src/styles`).

Each directory inside the styles directory corresponds to one output file e.g. `src/styles/components/` -> `.styles/components.json`.  
This documentation will refer to these directories as **layers** as it is recommended to structure them in the same way as [TailwindCSS's layers](https://tailwindcss.com/docs/functions-and-directives#layer) (`components`, `utilities` and `base`).

Each directory inside a layer will be referred to as an **entry**. Every entry must consist of a directory and a CSS file with the same name e.g. `src/styles/components/button/button.css`.  
By enforcing each entry to be a directory we encourage colocating documentation with the corresponding styles e.g. in form of stories.

A common file-structure might look like this:

```
src
└─ styles
   ├─ components
   │  ├─ button
   │  │  ├─ button.css
   │  │  ├─ button.mdx
   │  │  └─ button.stories.ts
   │  └─ card
   │     ├─ card.css
   │     ├─ card.mdx
   │     └─ card.stories.ts
   ├─ utilities
   │  └─ filter
   │     ├─ filter.css
   │     ├─ filter.mdx
   │     └─ filter.stories.ts
   └─ base
      └─ typography
         ├─ typography.css
         ├─ typography.mdx
         └─ typography.stories.ts
```
