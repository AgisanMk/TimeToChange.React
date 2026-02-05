import { useEffect, useState } from "react";
import type { CountryOption, RestCountry } from "../types/types.ts";

// Locale Normalization Helper, np. pl → Locale
export const normalizeLocale = (locale: string): string => {
  if (!locale) return "pl-PL";
  const parts = locale.replace("_", "-").split("-");
  if (parts.length === 1) return parts[0].toLowerCase();
  return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
};

export type UseFetchCountriesResult = {
  loading: boolean;
  countries: CountryOption[];
  currencyOptions: string[];
  countryToLocale: Record<string, string>;
  currenciesMap: Record<string, string>;
  userCountryCode?: string;
};

export const useFetchCountries = (
  normalizeLocale: (locale: string) => string,
): UseFetchCountriesResult => {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [countryToLocale, setCountryToLocale] = useState<
    Record<string, string>
  >({});
  const [currenciesMap, setCurrenciesMap] = useState<Record<string, string>>(
    {},
  );
  const [userCountryCode, setUserCountryCode] = useState<string>();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,currencies,cca2,languages",
        );
        const data: RestCountry[] = await response.json();

        const countriesList: CountryOption[] = [];
        const currencyMap: Record<string, string> = {};
        const localesMap: Record<string, string> = {};
        const allCurrencies = new Set<string>();

        data.forEach((country) => {
          const name = country.name?.common;
          const currencyCode = country.currencies
            ? Object.keys(country.currencies)[0]
            : "";
          const cca2 = country.cca2;
          const languageCode = country.languages
            ? Object.keys(country.languages)[0]
            : "pl";

          if (name && currencyCode && cca2) {
            countriesList.push({ name, cca2, currency: currencyCode });
            currencyMap[cca2] = currencyCode;
            localesMap[cca2] = normalizeLocale(`${languageCode}-${cca2}`);
            allCurrencies.add(currencyCode);
          }
        });

        countriesList.sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countriesList);
        setCurrenciesMap(currencyMap);
        setCountryToLocale(localesMap);
        setCurrencyOptions(Array.from(allCurrencies).sort());

        const browserLocale =
          navigator.language ||
          (navigator.languages && navigator.languages[0]) ||
          "pl-PL";
        const parts = browserLocale.replace("_", "-").split("-");
        const detectedCca2 =
          parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase();

        if (countriesList.some((c) => c.cca2 === detectedCca2)) {
          setUserCountryCode(detectedCca2);
        }
      } catch (err) {
        console.error("Failed to fetch countries or detect locale:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [normalizeLocale]);

  return {
    loading,
    countries,
    currencyOptions,
    countryToLocale,
    currenciesMap,
    userCountryCode,
  };
};
