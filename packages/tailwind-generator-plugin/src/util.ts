export const kinds = ['components'] as const;
export type Kind = (typeof kinds)[number];
export type Kinds = typeof kinds;
