export const currencies = ["IDR"] as const;

export type CurrencyCode = (typeof currencies)[number];
