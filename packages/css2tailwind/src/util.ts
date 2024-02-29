import { bundleRequire } from 'bundle-require';

import { ResolveTailwindConfigError } from './error';

import type { Config } from 'tailwindcss';

const defaultTailwindConfig: Config = { content: ['./**/*.css'] };

// TODO: logging, error handling
export async function readTailwindConfig(path?: string): Promise<Config> {
  if (!path) return defaultTailwindConfig;
  try {
    const bundle = await bundleRequire({
      filepath: path,
      preserveTemporaryFile: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-member-access
    const config = (bundle.mod.default ?? {}) as Config;
    // TODO: log a warning
    if (Object.keys(config).length <= 0) throw new Error();
    return config;
  } catch {
    throw new ResolveTailwindConfigError(`Failed to read tailwind configuration at ${path}.`);
  }
}

export type Result<TValue, TError = Error> =
  | { ok: true; value: TValue }
  | { ok: false; error: TError };

export function ok<TValue>(value: TValue) {
  return { ok: true, value } as const;
}
export function err<TError = Error>(error: TError) {
  return { ok: false, error } as const;
}

export function isPromiseFulfilled<TValue>(
  promiseResult: PromiseSettledResult<TValue>,
): promiseResult is PromiseFulfilledResult<TValue> {
  return promiseResult.status === 'fulfilled';
}

export function isPromiseRejected<TValue>(
  promiseResult: PromiseSettledResult<TValue>,
): promiseResult is PromiseRejectedResult {
  return promiseResult.status === 'rejected';
}

export function mapPromiseRejectedResultToReason(
  promiseRejectedResult: PromiseRejectedResult,
): unknown {
  return promiseRejectedResult.reason;
}
