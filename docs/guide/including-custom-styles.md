# Including Custom Styles

Once you have defined some base or utility styles, you might want to make use of your custom classes inside other custom CSS files.

For this to work you must import the corresponding entry using the `@import` directive.

Since each CSS file in compiled independently, using this custom class will fail:

```
src
└─ styles
   ├─ components
   │  └─ button
   │     └─ button.css
   └─ utilities
      └─ filter
         └─ filter.css
```

```css
/* filter.css */
.filter-hue-rotate {
  filter: hue-rotate(90deg);
}
```

```css
/* button.css */
.button {
  @apply filter-custom;
}
```

You will get following error:

<<< @/snippets/import-error.ansi

You can fix the error by explicitely importing the entry that defines you custom class:

```css
/* button.css */
@import "utilities/filter"; // [!code ++]

.button {
  @apply filter-custom;
}
```

::: tip

The general syntax for imports is `"<layer>/<entry>"`.  
In the above example the layer is `utilities` and the entry `fitler`.

:::
