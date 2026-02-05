import { v4 as uuidv4 } from "uuid";
import type {
  ExpenseRow,
  ExpensesState,
  ExpensesAction,
} from "../../types/types";
import { defaultExpenses } from "../../constants/defaultRows";

// Utils

const allowedCategories = ["fixed", "variable", "occasional"] as const;

const createEmptyExpenseRow = (): ExpenseRow => ({
  id: uuidv4(),
  name: "",
  category: "",
  amount: "",
  errors: { name: "", category: "", amount: "" },
});

const clearExpenseRow = (row: ExpenseRow): ExpenseRow => ({
  ...row,
  name: "",
  category: "",
  amount: "",
  errors: { name: "", category: "", amount: "" },
});

const normalizeFieldValue = (
  field: keyof ExpenseRow,
  value: string | number,
): any => {
  if (field === "amount") {
    if (value === "" || value == null) return 0;
    const num = typeof value === "number" ? value : parseFloat(String(value));
    return isNaN(num) ? 0 : num;
  }
  return value;
};

const validateExpenseRow = (row: ExpenseRow) => ({
  name: "", // We don't require a name
  category: !allowedCategories.includes(row.category as any)
    ? "Category is required"
    : "",
  amount:
    // the amount can be 0, only negative(-) are an error
    typeof row.amount === "number" && row.amount < 0 ? "Enter amount >= 0" : "",
});

// Session Storage

export const serializeExpenses = (rows: ExpenseRow[]) =>
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

export const persistExpenses = (rows: ExpenseRow[]) => {
  sessionStorage.setItem("expenses", JSON.stringify(serializeExpenses(rows)));
};

const loadInitialRows = (): ExpenseRow[] => {
  try {
    const stored = JSON.parse(sessionStorage.getItem("expenses") || "[]");

    const restored = (stored as any[])
      .map((item) => {
        // the amount can be numerically noted; we only normalise the type
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
        } as ExpenseRow;
      })
      .filter((row: ExpenseRow) => {
        //We filter out only completely blank rows (all blank/zero)
        const isNameEmpty = row.name.trim() === "";
        const isCategoryEmpty = row.category.trim() === "";
        const isAmountZero =
          (typeof row.amount === "number" && row.amount === 0) ||
          row.amount === "" ||
          isNaN(Number(row.amount));
        return !(isNameEmpty && isCategoryEmpty && isAmountZero);
      })
      .map((row: ExpenseRow) => ({
        ...row,
        errors: validateExpenseRow(row),
      }));

    return restored.length > 0 ? restored : [createEmptyExpenseRow()];
  } catch {
    return [createEmptyExpenseRow()];
  }
};

// Initial State

export const initialExpensesState: ExpensesState = {
  rows: loadInitialRows(),
};

// Reducer

export const expensesReducer = (
  state: ExpensesState,
  action: ExpensesAction,
): ExpensesState => {
  let newRows: ExpenseRow[];

  switch (action.type) {
    case "ADD_ROW":
      newRows = [...state.rows, createEmptyExpenseRow()];
      persistExpenses(newRows);
      return { ...state, rows: newRows };

    case "LOAD_DEFAULTS":
      newRows = defaultExpenses.map(
        (item): ExpenseRow => ({
          id: uuidv4(),
          name: item.name,
          category: item.category,
          amount: 0,
          errors: { name: "", category: "", amount: "" },
        }),
      );
      persistExpenses(newRows);
      return { rows: newRows };

    case "DELETE_ROW":
      if (state.rows.length === 1) {
        newRows = [clearExpenseRow(state.rows[0])];
        persistExpenses(newRows);
        return { ...state, rows: newRows };
      }
      newRows = state.rows.filter((row) => row.id !== action.payload);
      persistExpenses(newRows);
      return { ...state, rows: newRows };

    case "UPDATE_AND_VALIDATE_ROW":
      newRows = state.rows.map((row) => {
        if (row.id === action.payload.id) {
          const updatedValue = normalizeFieldValue(
            action.payload.field,
            action.payload.value,
          );
          const updatedRow: ExpenseRow = {
            ...row,
            [action.payload.field]: updatedValue,
          } as ExpenseRow;
          return {
            ...updatedRow,
            errors: validateExpenseRow(updatedRow),
          };
        }
        return row;
      });
      persistExpenses(newRows);
      return { ...state, rows: newRows };

    case "RESET":
      newRows = [createEmptyExpenseRow()];
      persistExpenses(newRows);
      return { rows: newRows };

    default:
      return state;
  }
};

// Totals

export const calculateExpenseTotals = (rows: ExpenseRow[]) => {
  const totals = { fixed: 0, variable: 0, occasional: 0 };

  rows.forEach((row) => {
    if (["fixed", "variable", "occasional"].includes(row.category)) {
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
    occasional: totals.occasional.toFixed(2),
  };
};
