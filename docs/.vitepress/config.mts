import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@titanom/css2tailwind',
  description:
    'A tool for compiling css files to CssInJs objects to be used inside tailwindcss plugins.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: 'https://github.com/titanom/css2tailwind/tree/master/examples' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Editor Setup', link: '/guide/editor-setup' },
        ],
      },
      {
        text: 'Writing',
        collapsed: false,
        items: [{ text: 'File Structure', link: '/guide/file-structure' }],
      },
      {
        text: 'Usage',
        collapsed: false,
        items: [
          { text: 'CLI', link: '/guide/cli' },
          { text: 'Applying Styles', link: '/guide/applying-styles' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/titanom/css2tailwind' }],
  },
});
