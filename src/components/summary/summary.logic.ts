import type { GoalRow } from "../../types/types";

// Calculate sums

// Sum all amounts in the array (expects amount as string or number)
// Returns formatted string with 2 decimal places
export const calculateTotal = (
  rows: Array<{ amount: string | number }>,
): string => {
  const total = rows.reduce(
    (sum, row) => sum + parseFloat(row.amount.toString() || "0"),
    0,
  );
  return total.toFixed(2);
};

// Calculate total monthly savings needed for goals
// Returns formatted string with 2 decimal places
export const calculateMonthlyGoalSavings = (goals: GoalRow[]): string => {
  const total = goals.reduce((sum, goal) => {
    const amount = parseFloat(goal.amount.toString() || "0");
    const years = parseInt(goal.year.toString() || "0", 10);
    if (years > 0) {
      return sum + amount / (years * 12);
    }
    return sum;
  }, 0);
  return total.toFixed(2);
};
