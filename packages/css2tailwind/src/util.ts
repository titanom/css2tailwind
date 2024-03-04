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
  } catch (error) {
    console.log('--------------------------------------', error);
    throw new ResolveTailwindConfigError(`Failed to read tailwind configuration at ${path}.`);
  }
}

export type ResultOk<TValue> = { ok: true; value: TValue };
export type ResultErr<TError> = { ok: false; error: TError };
export type Result<TValue, TError = Error> = ResultOk<TValue> | ResultErr<TError>;

export function ok<TValue>(value: TValue) {
  return { ok: true, value } as const;
}
export function err<TError = Error>(error: TError) {
  return { ok: false, error } as const;
}

export function isOk<TValue, TError>(
  result: Result<TValue, TError>,
): result is { ok: true; value: TValue } {
  return result.ok;
}

export function isErr<TValue, TError>(
  result: Result<TValue, TError>,
): result is { ok: false; error: TError } {
  return !result.ok;
}

export function mapOkResultToValue<TValue>(result: ResultOk<TValue>) {
  return result.value;
}

export function mapErrResultToError<TError>(result: ResultErr<TError>) {
  return result.error;
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

export function mapPromiseFulfilledResultToValue<TValue>(
  promiseRejectedResult: PromiseFulfilledResult<TValue>,
): TValue {
  return promiseRejectedResult.value;
}
