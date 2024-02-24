import _plugin, { type withOptions } from 'tailwindcss/plugin';

import { configSchema } from './config';

// this is a workaround because typescript doesn't want to give me the type of `plugin` when default importing
type Plugin = ReturnType<ReturnType<typeof withOptions>>;
type PluginCreator = Plugin['handler'];
type PluginConfig = Plugin['config'];
const plugin = _plugin as (creator: PluginCreator, config?: PluginConfig) => Plugin;

export default plugin(({ config }) => {
  const conf = configSchema.parse(config('blah'));
  console.debug({ conf });
});
