import React, { type ReactNode } from "react";

// Country & Currency

export type RestCountry = {
  name?: { common: string };
  currencies?: Record<string, { name?: string; symbol?: string }>; //"currencies": {"PLN": {"name": "Polish złoty","symbol": "zł"}}
  cca2: string; // 2-letter country code
  languages?: Record<string, string>;
};

export interface CountryOption {
  cca2: string;
  name: string;
  currency: string;
}

export type FormatCurrencyOptions = {
  locale?: string | undefined;
  currency?: string | undefined;
  cache?: boolean;
};

//  API Context

export type ApiContextType = {
  profileState: ExtendedProfileState;
  dispatch: React.Dispatch<ProfileAction>;
  loadingCountries: boolean;
  countryOptions: CountryOption[];
  currency: string;
  locale: string;
  resetProfileContext: () => void; // Reset profile context to initial state
};

export type ApiProviderProps = { children: ReactNode };

// Profile User

export type FieldErrors = {
  amount?: string;
  name?: string;
  calcNumber?: string;
  country?: string;
  currency?: string;
};

// State for Profile User
export interface ProfileState {
  name: string;
  calcNumber: string;
  country: string;
  currency: string;
  locale: string;
  errors: FieldErrors;
  countryToLocale: Record<string, string>; // mapping country to locale
  currencyOptions: string[]; // List of available currencies
}

export interface ExtendedProfileState extends ProfileState {
  countryOptions: CountryOption[];
  currenciesMap: Record<string, string>; // CCA2 Mapping - > Currency Code
}

// Only these form fields can be dynamically updated
export type ProfileField =
  | "name"
  | "calcNumber"
  | "country"
  | "currency"
  | "locale";

// Actions for profile reducer

export type ProfileAction =
  | { type: "UPDATE_FIELD"; field: ProfileField; value: string }
  | { type: "SET_COUNTRIES"; countries: CountryOption[] }
  | { type: "SET_CURRENCIES_MAP"; currenciesMap: Record<string, string> }
  | { type: "SET_COUNTRY_TO_LOCALE"; countryToLocale: Record<string, string> }
  | { type: "SET_CURRENCY_OPTIONS"; currencyOptions: string[] }
  | { type: "SET_ERRORS"; errors: FieldErrors }
  | { type: "RESET" };

// Financial data types

export interface Goal {
  id: string;
  goal: string;
  year: string | number;
  amount: string | number;
}

export interface Income {
  id: string;
  name: string;
  category: "fixed" | "variable" | "passive" | "";
  amount: string | number;
}
export type IncomeTemplate = Pick<Income, "name" | "category">; // Income template (without ID)

export interface Expense {
  id: string;
  name: string;
  category: "fixed" | "variable" | "occasional" | "";
  amount: string | number;
}

export type ExpenseTemplate = Pick<Expense, "name" | "category">; // Expense template (without ID)

// UI row types (with errors for validation and displaying errors)

export interface GoalRow extends Goal {
  errors: Partial<{
    goal: string;
    year: string;
    amount: string;
  }>;
}

export interface IncomeRow extends Income {
  errors: Partial<{
    name: string;
    category: string;
    amount: string;
  }>;
}

export interface ExpenseRow extends Expense {
  errors: Partial<{
    name: string;
    category: string;
    amount: string;
  }>;
}

// Component props

export interface GoalsProps {
  resetSignal?: boolean;
  goals: GoalRow[];
  dispatch: React.Dispatch<GoalsAction>;
}

export interface IncomesProps {
  resetSignal?: boolean;
  incomes: IncomeRow[];
  dispatch: React.Dispatch<IncomesAction>;
}

export interface ExpensesProps {
  resetSignal?: boolean;
  expenses: ExpenseRow[];
  dispatch: React.Dispatch<ExpensesAction>;
}

export interface SummaryProps {
  goals: GoalRow[];
  incomes: IncomeRow[];
  expenses: ExpenseRow[];
  result: CalculationResult | null;
  setResult: (result: CalculationResult | null) => void;
}

// Reducer and state for Goals

export interface GoalsState {
  rows: GoalRow[];
}

export type GoalsAction =
  | { type: "ADD_ROW" }
  | { type: "DELETE_ROW"; payload: string }
  | {
      type: "UPDATE_AND_VALIDATE_ROW";
      payload: {
        id: string;
        field: keyof Omit<GoalRow, "errors" | "id">;
        value: string | number;
      };
    }
  | { type: "RESET" };

// Reducer and state for Incomes

export interface IncomesState {
  rows: IncomeRow[];
}

export type IncomesAction =
  | { type: "ADD_ROW" }
  | { type: "LOAD_DEFAULTS" }
  | { type: "DELETE_ROW"; payload: string }
  | {
      type: "UPDATE_AND_VALIDATE_ROW";
      payload: {
        id: string;
        field: keyof Omit<IncomeRow, "errors" | "id">;
        value: string | number;
      };
    }
  | { type: "RESET" };

// Reducer and state for Expenses

export interface ExpensesState {
  rows: ExpenseRow[];
}

export type ExpensesAction =
  | { type: "ADD_ROW" }
  | { type: "LOAD_DEFAULTS" }
  | { type: "DELETE_ROW"; payload: string }
  | {
      type: "UPDATE_AND_VALIDATE_ROW";
      payload: {
        id: string;
        field: keyof Omit<ExpenseRow, "errors" | "id">;
        value: string | number;
      };
    }
  | { type: "RESET" };

// Backend calculation types

export interface GetCalculationPayloadParams {
  userId: number;
  incomes: IncomesState;
  expenses: ExpensesState;
  goals: GoalsState;
}

export interface CalculationPayload {
  userId: number;
  currencyCode: string;
  incomes: BackendIncome[];
  expenses: BackendExpense[];
  goals: BackendGoal[];
}

export interface BackendIncome {
  name: string;
  category: string;
  amount: number;
}

export interface BackendExpense {
  name: string;
  category: string;
  amount: number;
}

export interface BackendGoal {
  name: string;
  periodInYears: number;
  amountTarget: number;
}

export interface CalculationResult {
  financialLevel: {
    id: number;
    name: string;
    text: string;
    missingAmount: number;
    surplusAmount: number;
  };
}

// About / Content types

export type Language = "en" | "pl";

export type FeatureSection = {
  title: string;
  text: React.ReactNode;
  list?: string[];
  backend?: React.ReactNode;
};

export type Content = {
  heading: string;
  intro1: React.ReactNode;
  intro2: React.ReactNode;
  purposeHeading: string;
  purposeText: React.ReactNode;
  purposeListIntro: React.ReactNode;
  purposeList: string[];
  featuresHeading: string;
  featuresIntro: React.ReactNode;
  features: Record<string, FeatureSection>;
  techHeading: string;
  techList: string[];
  nextHeading: string;
  nextText: React.ReactNode;
};

export type AboutViewProps = {
  content: Content;
  language: "en" | "pl";
  onToggleLanguage: () => void;
};
