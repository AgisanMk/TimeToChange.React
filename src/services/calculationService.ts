import type {
  CalculationPayload,
  GetCalculationPayloadParams,
  CalculationResult,
} from "../types/types";

// Auxiliary function for parsing numbers, empty => 0
const parseNumber = (value: string | number | undefined | null): number => {
  if (value === "" || value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

export function getCalculationPayload(
  input: GetCalculationPayloadParams,
  currencyCode: string,
): CalculationPayload {
  const mapIncomeRows = input.incomes.rows.map(
    ({ name, category, amount }) => ({
      name,
      category,
      amount: parseNumber(amount),
    }),
  );

  const mapExpenseRows = input.expenses.rows.map(
    ({ name, category, amount }) => ({
      name,
      category,
      amount: parseNumber(amount),
    }),
  );

  const mapGoalRows = input.goals.rows.map(({ goal, year, amount }) => ({
    name: goal,
    periodInYears: parseNumber(year),
    amountTarget: parseNumber(amount),
  }));

  return {
    userId: input.userId,
    currencyCode,
    incomes: mapIncomeRows,
    expenses: mapExpenseRows,
    goals: mapGoalRows,
  };
}

export async function sendCalculationToApi(
  payload: CalculationPayload,
): Promise<CalculationResult | null> {
  try {
    const body = JSON.stringify(payload);
    const apiUrl = "https://api.timetochange.work";

    const response = await fetch(`${apiUrl}/calculation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const text = await response.text(); // We always read the body, even when it's not ok
    if (!response.ok) {
      console.error("API error response body:", text);
      throw new Error(
        `Server error: ${response.status} ${response.statusText} - ${text}`,
      );
    }

    // Try parsing JSON if there is
    let data: CalculationResult;
    try {
      data = JSON.parse(text) as CalculationResult;
    } catch (e) {
      console.error("Failed to parse success response as JSON:", text);
      throw e;
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
