import { bgRed, black, red } from 'colorette';

import type { CssSyntaxError } from 'postcss';

export class NoStylesDirectoryError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class CompilationError extends Error {
  public constructor(message: string) {
    super(message);
  }

  public override toString() {
    return this.message;
  }
}

export class ResolveTailwindConfigError extends Error {
  private readonly errorName = 'ERR_RESOLVE_TAILWIND_CONFIG';

  public constructor(message: string) {
    super(message);
  }

  public override toString() {
    return `${bgRed(` ${this.errorName} `)} ${red(this.message)}`;
  }
}

export class SyntaxError extends Error {
  private readonly errorName = 'ERR_CSS_SYNTAX';

  public constructor(public readonly error: CssSyntaxError) {
    super(error.message);
  }

  public override toString() {
    return `${bgRed(` ${black(this.errorName)} `)} ${this.error.reason} at ${this.error.input?.file ?? this.error.file}:${this.error.input?.line}:${this.error.input?.column}

${this.error.showSourceCode()}
`;
  }

  public static dedupe(...errors: SyntaxError[]) {
    console.debug(errors.map((error) => error));
  }

  public key() {
    return `${this.error.line}:${this.error.column}:${this.error.reason}`;
  }
}

export function isSyntaxError(error: unknown): error is SyntaxError {
  return error instanceof SyntaxError;
}

export function dedupeSyntaxErrors(errors: SyntaxError[]) {
  const blah = new Map<string, SyntaxError>();

  for (const error of errors) {
    const key = error.key();
    // if an error has a file path, prefer it over the other one(s)
    const hasFile = Boolean(error.error.input?.file ?? error.error.file);
    if (!blah.has(key) || hasFile) {
      blah.set(key, error);
    }
  }

  return Array.from(blah.values());
}
