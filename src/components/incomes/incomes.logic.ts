import { v4 as uuidv4 } from "uuid";
import type { IncomeRow, IncomesState, IncomesAction } from "../../types/types";
import { defaultIncomes } from "../../constants/defaultRows";

// Utils

const allowedCategories = ["fixed", "variable", "passive"] as const;

const createEmptyIncomeRow = (): IncomeRow => ({
  id: uuidv4(),
  name: "",
  category: "",
  amount: "",
  errors: { name: "", category: "", amount: "" },
});

const clearIncomeRow = (row: IncomeRow): IncomeRow => ({
  ...row,
  name: "",
  category: "",
  amount: "",
  errors: { name: "", category: "", amount: "" },
});

const normalizeFieldValue = (
  field: keyof IncomeRow,
  value: string | number,
): any => {
  if (field === "amount") {
    if (value === "" || value == null) return 0;
    const num = typeof value === "number" ? value : parseFloat(String(value));
    return isNaN(num) ? 0 : num;
  }
  return value;
};

const validateIncomeRow = (row: IncomeRow) => ({
  name: "", // We don't require a name
  category: !allowedCategories.includes(row.category as any)
    ? "Category is required"
    : "",
  amount:
    // Amount can be 0, only negative(-) are an error
    typeof row.amount === "number" && row.amount < 0 ? "Enter amount >= 0" : "",
});

// Session Storage

export const serializeIncomes = (rows: IncomeRow[]) =>
  rows
    .filter((row) => {
      // We reject only absolutely empty (all empty/zero)
      const isNameEmpty = row.name.trim() === "";
      const isCategoryEmpty = row.category.trim() === "";
      const isAmountZero =
        (typeof row.amount === "number" && row.amount === 0) ||
        row.amount === "" ||
        isNaN(Number(row.amount));
      return !(isNameEmpty && isCategoryEmpty && isAmountZero);
    })
    .map(({ errors, ...rest }) => ({
      ...rest,
      // For storage: if the amount is an empty string, we replace it with 0
      amount:
        rest.amount === "" || rest.amount == null
          ? 0
          : typeof rest.amount === "number"
            ? rest.amount
            : parseFloat(String(rest.amount)),
    }));

export const persistIncomes = (rows: IncomeRow[]) => {
  sessionStorage.setItem("incomes", JSON.stringify(serializeIncomes(rows)));
};

const loadInitialRows = (): IncomeRow[] => {
  try {
    const stored = JSON.parse(sessionStorage.getItem("incomes") || "[]");

    const restored = (stored as any[])
      .map((item) => {
        // Amount can be numerically noted; we only normalise the type
        const amountNormalized =
          item.amount === "" || item.amount == null
            ? 0
            : typeof item.amount === "number"
              ? item.amount
              : parseFloat(String(item.amount));
        return {
          ...item,
          amount: isNaN(amountNormalized) ? 0 : amountNormalized,
          name: item.name ?? "",
          category: item.category ?? "",
          errors: { name: "", category: "", amount: "" },
        } as IncomeRow;
      })
      // We filter out only completely blank rows (all blank/zero)
      .filter((row: IncomeRow) => {
        const isNameEmpty = row.name.trim() === "";
        const isCategoryEmpty = row.category.trim() === "";
        const isAmountZero =
          (typeof row.amount === "number" && row.amount === 0) ||
          row.amount === "" ||
          isNaN(Number(row.amount));
        return !(isNameEmpty && isCategoryEmpty && isAmountZero);
      })
      .map((row: IncomeRow) => ({
        ...row,
        errors: validateIncomeRow(row),
      }));

    return restored.length > 0 ? restored : [createEmptyIncomeRow()];
  } catch {
    return [createEmptyIncomeRow()];
  }
};

// Initial State

export const initialIncomesState: IncomesState = {
  rows: loadInitialRows(),
};

// Reducer

export const incomesReducer = (
  state: IncomesState,
  action: IncomesAction,
): IncomesState => {
  let newRows: IncomeRow[];

  switch (action.type) {
    case "ADD_ROW":
      newRows = [...state.rows, createEmptyIncomeRow()];
      persistIncomes(newRows);
      return { ...state, rows: newRows };

    case "LOAD_DEFAULTS":
      newRows = defaultIncomes.map(
        (item): IncomeRow => ({
          id: uuidv4(),
          name: item.name,
          category: item.category,
          amount: 0,
          errors: { name: "", category: "", amount: "" },
        }),
      );
      persistIncomes(newRows);
      return { rows: newRows };

    case "DELETE_ROW":
      if (state.rows.length === 1) {
        newRows = [clearIncomeRow(state.rows[0])];
        persistIncomes(newRows);
        return { ...state, rows: newRows };
      }
      newRows = state.rows.filter((row) => row.id !== action.payload);
      persistIncomes(newRows);
      return { ...state, rows: newRows };

    case "UPDATE_AND_VALIDATE_ROW":
      newRows = state.rows.map((row) => {
        if (row.id === action.payload.id) {
          const updatedValue = normalizeFieldValue(
            action.payload.field,
            action.payload.value,
          );
          const updatedRow: IncomeRow = {
            ...row,
            [action.payload.field]: updatedValue,
          } as IncomeRow;
          return {
            ...updatedRow,
            errors: validateIncomeRow(updatedRow),
          };
        }
        return row;
      });
      persistIncomes(newRows);
      return { ...state, rows: newRows };

    case "RESET":
      newRows = [createEmptyIncomeRow()];
      persistIncomes(newRows);
      return { rows: newRows };

    default:
      return state;
  }
};

// Totals

export const calculateIncomeTotals = (rows: IncomeRow[]) => {
  const totals = { fixed: 0, variable: 0, passive: 0 };

  rows.forEach((row) => {
    if (["fixed", "variable", "passive"].includes(row.category)) {
      const amount =
        typeof row.amount === "number"
          ? row.amount
          : parseFloat(String(row.amount));
      if (!isNaN(amount)) {
        totals[row.category as keyof typeof totals] += amount;
      }
    }
  });

  return {
    fixed: totals.fixed.toFixed(2),
    variable: totals.variable.toFixed(2),
    passive: totals.passive.toFixed(2),
  };
};
