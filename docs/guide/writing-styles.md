# Writing Styles

## Classes

CSS classes you define in your stylesheets will be compiled to tailwind tokens.

You give your classes arbitrary names, but it is good practice to structure them based on your filenames.

e.g.

```css
/* styles/components/button/button.css */

/* good */
.button {
  /* ... */
}

/* bad (but theoretically possible) */
.btn {
  /* ... */
}
```

## Nesting

To avoid repetition and classes and allow better structure of your styles, this tool allows nesting your styles using [postcss-nested](https://github.com/postcss/postcss-nested).

```css
.button {
  @apply p-4;

  &-primary {
    @apply bg-red-400;
  }

  &-secondary {
    @apply bg-green-400;
  }
}
```

is equivalent to:

```css
.button {
  @apply p-4;
}

.button-primary {
  @apply bg-red-400;
}

.button-secondary {
  @apply bg-green-400;
}
```
