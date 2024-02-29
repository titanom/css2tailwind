import { bgRed, red } from 'colorette';

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
