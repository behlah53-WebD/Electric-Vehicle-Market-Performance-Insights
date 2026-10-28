/**
 * Uniform number and currency formatting utilities to ensure
 * deterministic SSR and Client hydration matching across all locales.
 */

export function formatNumber(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return "0";
  return val.toLocaleString("en-US");
}

export function formatCurrency(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return "$0";
  return `$${val.toLocaleString("en-US")}`;
}
