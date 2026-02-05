import { useEffect } from "react";
import {
  useFetchCountries,
  normalizeLocale,
} from "../../utils/useFetchCountries";
import type { Dispatch, ChangeEvent, FormEvent } from "react";
import type {
  ProfileAction,
  ExtendedProfileState,
  ProfileField,
  FieldErrors,
} from "../../types/types";

// Initial State

export const initialProfileState: ExtendedProfileState = {
  name: "",
  calcNumber: "",
  country: "",
  currency: "",
  locale: "",
  countryOptions: [],
  currencyOptions: [],
  currenciesMap: {},
  countryToLocale: {},
  errors: {},
};

// Validation

export const validateProfileForm = (
  state: ExtendedProfileState,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!state.name.trim()) errors.name = "Name is required";
  if (!state.calcNumber) errors.calcNumber = "Calculation number required";
  if (!state.country) errors.country = "Country is required";
  if (!state.currency) errors.currency = "Currency is required";

  return errors;
};

// Factories

export const handleChangeFactory =
  (dispatch: Dispatch<ProfileAction>) =>
  (
    field: ProfileField,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

export const handleSubmitFactory =
  (
    state: ExtendedProfileState,
    dispatch: Dispatch<ProfileAction>,
    countryToLocale: Record<string, string>,
  ) =>
  (e: FormEvent) => {
    e.preventDefault();

    const errors = validateProfileForm(state);
    dispatch({ type: "SET_ERRORS", errors });

    if (Object.keys(errors).length === 0) {
      const locale = countryToLocale[state.country] || "pl-PL";
      alert(
        `Form is valid! Example currency: ${new Intl.NumberFormat(locale, {
          style: "currency",
          currency: state.currency,
        }).format(1234.56)}`,
      );
    }
  };

// Reducer

export function profileReducer(
  state: ExtendedProfileState,
  action: ProfileAction,
): ExtendedProfileState {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const { field, value } = action;
      let newState: ExtendedProfileState = {
        ...state,
        [field]: value,
        errors: { ...state.errors, [field]: "" },
      };

      if (field === "country") {
        const newCurrency = state.currenciesMap[value] || "";
        const newLocale = state.countryToLocale[value] || state.locale;
        newState = { ...newState, currency: newCurrency, locale: newLocale };
      }

      if (field === "currency") {
        const matchedCountry =
          Object.entries(state.currenciesMap).find(
            ([, curr]) => curr === value,
          )?.[0] || "";

        const newLocale = matchedCountry
          ? state.countryToLocale[matchedCountry]
          : state.locale;

        newState = {
          ...newState,
          country: state.country || matchedCountry,
          locale: newLocale,
        };
      }

      return newState;
    }

    case "SET_ERRORS":
      return { ...state, errors: action.errors };

    case "SET_COUNTRIES":
      return { ...state, countryOptions: action.countries };

    case "SET_CURRENCY_OPTIONS":
      return { ...state, currencyOptions: action.currencyOptions };

    case "SET_CURRENCIES_MAP":
      return { ...state, currenciesMap: action.currenciesMap };

    case "SET_COUNTRY_TO_LOCALE":
      return { ...state, countryToLocale: action.countryToLocale };

    case "RESET":
      return {
        ...initialProfileState,
        countryOptions: state.countryOptions,
        currenciesMap: state.currenciesMap,
        countryToLocale: state.countryToLocale,
      };

    default:
      return state;
  }
}

// Initialization Hook

export function useProfileSetup(dispatch: Dispatch<ProfileAction>) {
  const {
    loading,
    countries,
    currencyOptions,
    currenciesMap,
    userCountryCode,
    countryToLocale,
  } = useFetchCountries(normalizeLocale);

  useEffect(() => {
    if (!countries.length) return;

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
      dispatch({
        type: "UPDATE_FIELD",
        field: "currency",
        value: currenciesMap[userCountryCode],
      });
    }
  }, [
    countries,
    currencyOptions,
    currenciesMap,
    countryToLocale,
    userCountryCode,
    dispatch,
  ]);

  return { loading };
}
