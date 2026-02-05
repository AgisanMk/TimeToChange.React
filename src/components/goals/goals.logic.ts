import { v4 as uuidv4 } from "uuid";
import type { GoalRow, GoalsAction, GoalsState } from "../../types/types";

// Utils

export const createEmptyRow = (): GoalRow => ({
  id: uuidv4(),
  goal: "",
  year: "",
  amount: "",
  errors: {},
});

const normalizeRowForUpdate = (
  row: GoalRow,
  field: string,
  value: string,
): GoalRow => {
  // If we update the amount and get an empty string, we treat it as "0"
  const normalizedValue =
    field === "amount" && value.trim() === "" ? "0" : value;

  return {
    ...row,
    [field]: normalizedValue,
  };
};

export const validateGoalRow = (row: GoalRow): Record<string, string> => {
  const errors: Record<string, string> = {};
  // Goal can be empty - we do not validate as required
  const yearNum = Number(row.year);
  const amountNum = Number(row.amount);

  if (row.year === "" || isNaN(yearNum) || yearNum <= 0) {
    errors.year = "Enter years > 0";
  }

  if (row.amount === "" || isNaN(amountNum) || amountNum <= 0) {
    errors.amount = "Enter amount > 0";
  }

  return errors;
};

// Session Storage

export const serializeGoals = (rows: GoalRow[]) =>
  rows
    .filter(
      (row) =>
        row.goal.trim() !== "" ||
        Number(row.year) !== 0 ||
        Number(row.amount) !== 0,
    )
    .map(({ id, goal, year, amount }) => ({
      id,
      goal: goal.trim(),
      year,
      amount,
    }))
    .filter(
      (row) =>
        row.year !== "" &&
        row.amount !== "" &&
        !isNaN(Number(row.year)) &&
        !isNaN(Number(row.amount)),
    );

export const persistGoals = (rows: GoalRow[]) => {
  sessionStorage.setItem("goals", JSON.stringify(serializeGoals(rows)));
};

const loadInitialGoals = (): GoalRow[] => {
  try {
    const stored = JSON.parse(sessionStorage.getItem("goals") || "[]");

    const restored = stored.map((item: any) => {
      const withDefaults: GoalRow = {
        ...item,
        goal: item.goal ?? "",
        year: item.year ?? "",
        amount: item.amount ?? "",
        errors: {},
      };
      return {
        ...withDefaults,
        errors: validateGoalRow(withDefaults),
      };
    });

    return restored.length > 0 ? restored : [createEmptyRow()];
  } catch {
    return [createEmptyRow()];
  }
};

// Initial State

export const initialGoalsState: GoalsState = {
  rows: loadInitialGoals(),
};

// Reducer

export const goalsReducer = (
  state: GoalsState,
  action: GoalsAction,
): GoalsState => {
  let newRows: GoalRow[];

  switch (action.type) {
    case "ADD_ROW":
      newRows = [...state.rows, createEmptyRow()];
      persistGoals(newRows);
      return { ...state, rows: newRows };

    case "DELETE_ROW":
      newRows = state.rows.filter((row) => row.id !== action.payload);
      if (newRows.length === 0) newRows = [createEmptyRow()];
      persistGoals(newRows);
      return { ...state, rows: newRows };

    case "UPDATE_AND_VALIDATE_ROW": {
      const { id, field, value } = action.payload;
      newRows = state.rows.map((row) => {
        if (row.id === id) {
          const valStr = typeof value === "number" ? String(value) : value;
          const updatedRow = normalizeRowForUpdate(row, field, valStr);
          return {
            ...updatedRow,
            errors: validateGoalRow(updatedRow),
          };
        }
        return row;
      });
      persistGoals(newRows);
      return { ...state, rows: newRows };
    }

    case "RESET":
      newRows = [createEmptyRow()];
      persistGoals(newRows);
      return { ...state, rows: newRows };

    default:
      return state;
  }
};

// Totals

export const calculateGoalTotals = (rows: GoalRow[]) => {
  let totalAmount = 0;
  let totalMonthly = 0;

  for (const row of rows) {
    const amount = Number(row.amount);
    const year = Number(row.year);

    if (!isNaN(amount)) totalAmount += amount;
    if (!isNaN(amount) && !isNaN(year) && year > 0) {
      totalMonthly += amount / (year * 12);
    }
  }

  return {
    totalAmount: totalAmount.toFixed(2),
    totalMonthly: totalMonthly.toFixed(2),
  };
};
