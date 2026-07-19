/** Money is always stored as integer minor units (cents for USD). */

export type Money = {
  amountCents: bigint;
  currency: string;
};

const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND"]);

export function currencyFractionDigits(currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? 0 : 2;
}

export function toCents(amount: number, currency = "USD"): bigint {
  const digits = currencyFractionDigits(currency);
  const factor = 10 ** digits;
  return BigInt(Math.round(amount * factor));
}

export function fromCents(amountCents: bigint | number, currency = "USD"): number {
  const digits = currencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Number(amountCents) / factor;
}

export function formatMoney(
  amountCents: bigint | number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(fromCents(amountCents, currency));
}

export function normalizePayee(payee: string): string {
  return payee
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function transactionFingerprint(input: {
  date: string; // YYYY-MM-DD
  amountCents: bigint | number;
  payee: string;
}): string {
  return [
    input.date,
    String(input.amountCents),
    normalizePayee(input.payee),
  ].join("|");
}
