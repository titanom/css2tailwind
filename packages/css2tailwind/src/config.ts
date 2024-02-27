import { z } from 'zod';

export const configSchema = z.object({
  pluginGenerator: z.object({ stylesDirectory: z.string() }),
});
export type Config = z.infer<typeof configSchema>;
