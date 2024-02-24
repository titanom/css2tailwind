import { z } from 'zod';

export const configSchema = z.object({
  pluginGenerator: z.object({ cacheDir: z.string().optional() }).optional(),
});
export type Config = z.infer<typeof configSchema>;
