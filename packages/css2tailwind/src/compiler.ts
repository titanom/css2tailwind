import postcssJs, { type CssInJs } from 'postcss-js';
import nestingPlugin from 'tailwindcss/nesting';

import postcss, { type Root } from 'postcss';
import tailwindPlugin from 'tailwindcss';

export async function compileStyleSheet(raw: string): Promise<CssInJs> {
  const ast = postcss.parse(raw);

  const processedAst = await postcss([
    nestingPlugin(),
    tailwindPlugin({ content: ['./**/*.css'] }),
  ]).process(ast, {
    from: undefined,
    parser: postcss.parse,
  });

  const cssInJs = postcssJs.objectify(processedAst.root as Root);

  return cssInJs;
}
