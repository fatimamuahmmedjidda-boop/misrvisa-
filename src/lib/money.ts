// All money in this codebase is handled as integer minor units (US cents, kobo,
// piastres…). Floating point is never used for financial arithmetic.

export const DEFAULT_MINOR_UNITS = 2;

export function toMinor(amount: number, minorUnits = DEFAULT_MINOR_UNITS): number {
  return Math.round(amount * 10 ** minorUnits);
}

export function fromMinor(minor: number, minorUnits = DEFAULT_MINOR_UNITS): number {
  return minor / 10 ** minorUnits;
}

export function formatMoney(minor: number, currency: string, minorUnits = DEFAULT_MINOR_UNITS): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: minorUnits === 0 ? 0 : 2,
      maximumFractionDigits: minorUnits === 0 ? 0 : 2,
    }).format(fromMinor(minor, minorUnits));
  } catch {
    return `${currency} ${fromMinor(minor, minorUnits).toFixed(minorUnits)}`;
  }
}

/**
 * Converts a base-currency (USD) minor amount into another currency's minor
 * amount using an explicit rate. The rate always comes from the database, never
 * from the browser.
 */
export function convertMinor(baseMinor: number, rate: number, targetMinorUnits = DEFAULT_MINOR_UNITS, baseMinorUnits = DEFAULT_MINOR_UNITS): number {
  const baseMajor = baseMinor / 10 ** baseMinorUnits;
  return Math.round(baseMajor * rate * 10 ** targetMinorUnits);
}

export function sumMinor(values: number[]): number {
  return values.reduce((total, v) => total + v, 0);
}
