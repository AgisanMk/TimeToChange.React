import { createContext, useContext, useReducer, useEffect } from "react";

import { normalizeLocale, useFetchCountries } from "../utils/useFetchCountries";

import {
  profileReducer,
  initialProfileState,
} from "../components/profile-user/profile-user.logic";

import type { ApiContextType, ApiProviderProps } from "../types/types";

import { deriveSettings } from "../utils/formatSettings";

const STORAGE_KEY = "profile";

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const {
    loading: loadingCountries,
    countries,
    currencyOptions,
    currenciesMap,
    userCountryCode,
    countryToLocale,
  } = useFetchCountries(normalizeLocale);

  const [profileState, dispatch] = useReducer(
    profileReducer,
    initialProfileState,
    (initial) => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...initial, ...JSON.parse(saved) };
        }
      } catch (err) {
        console.warn("Failed to parse profile from sessionStorage", err);
      }
      return initial;
    },
  );

  // Set data from API to reducer
  const populateProfileDataFromApi = () => {
    if (countries.length === 0) return;

    dispatch({ type: "SET_COUNTRIES", countries });
    dispatch({ type: "SET_CURRENCY_OPTIONS", currencyOptions });
    dispatch({ type: "SET_CURRENCIES_MAP", currenciesMap });
    dispatch({ type: "SET_COUNTRY_TO_LOCALE", countryToLocale });

    if (userCountryCode && currenciesMap[userCountryCode]) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "country",
        value: userCountryCode,
      });
    }
  };

  useEffect(() => {
    populateProfileDataFromApi();
  }, [
    countries,
    currencyOptions,
    currenciesMap,
    countryToLocale,
    userCountryCode,
  ]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profileState));
    } catch (err) {
      console.warn("Failed to save profile to sessionStorage", err);
    }
  }, [profileState]);

  // Profile reset + reload country and currency data
  const resetProfileContext = () => {
    dispatch({ type: "RESET" });
    populateProfileDataFromApi();
  };

  const { currency, locale } = deriveSettings(
    profileState.currency,
    countryToLocale,
    profileState.country,
  );

  const value: ApiContextType = {
    profileState,
    dispatch,
    loadingCountries,
    countryOptions: profileState.countryOptions ?? [],
    currency,
    locale,
    resetProfileContext,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApiContext = (): ApiContextType => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApiContext must be used within ApiProvider");
  return ctx;
};
