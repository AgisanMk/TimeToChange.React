import type { FormatCurrencyOptions } from "../types/types.ts";

const formatterCache = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (
  value: string,
  currency: string | undefined,
  locale: string | undefined,
  { cache = true }: FormatCurrencyOptions = {},
): string => {
  const num = Number(value);

  // Safe Number Value
  if (!Number.isFinite(num)) return "-";

  const key = `${locale}|${currency}`;

  // Re-use of the formatter (cache)
  let formatter: Intl.NumberFormat;
  if (cache && formatterCache.has(key)) {
    formatter = formatterCache.get(key)!;
  } else {
    try {
      formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      });
      if (cache) formatterCache.set(key, formatter);
    } catch (err) {
      console.error("formatCurrency – invalid locale or currency", err);
      return value;
    }
  }

  return formatter.format(num);
};
