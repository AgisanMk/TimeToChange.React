// Derives final currency and locale from profile state and maps.

export function deriveSettings(
  stateCurrency: string,
  countryToLocale: Record<string, string>,
  stateCountry: string,
) {
  const currency = stateCurrency || "PLN";
  const locale = countryToLocale[stateCountry] || "pl-PL";
  return { currency, locale };
}
