import type { ExpenseTemplate, IncomeTemplate } from "../types/types.ts";

export const defaultIncomes: IncomeTemplate[] = [
  { name: "Salary", category: "fixed" },
  { name: "Freelance", category: "variable" },
  { name: "Rental", category: "passive" },
];

export const defaultExpenses: ExpenseTemplate[] = [
  { name: "Bills", category: "fixed" },
  { name: "Instalment", category: "fixed" },
  { name: "Insurance", category: "fixed" },
  { name: "Family", category: "fixed" },
  { name: "Shopping", category: "variable" },
  { name: "Services", category: "variable" },
  { name: "Entertainment", category: "variable" },
  { name: "Travel", category: "variable" },
  { name: "Health", category: "variable" },
  { name: "Investments", category: "occasional" },
  { name: "Charity", category: "occasional" },
];
