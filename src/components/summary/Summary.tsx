import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import {
  calculateMonthlyGoalSavings,
  calculateTotal,
} from "./summary.logic.ts";
import type {
  GoalRow,
  IncomeRow,
  ExpenseRow,
  SummaryProps,
} from "../../types/types";
import {
  getCalculationPayload,
  sendCalculationToApi,
} from "../../services/calculationService";
import { useApiContext } from "../../context/apiContext.tsx";
import { formatCurrency } from "../../utils/formatCurrency.ts";

export const Summary = ({
  goals,
  incomes,
  expenses,
  result,
  setResult,
}: SummaryProps) => {
  const { currency = "PLN", locale = "pl-PL" } = useApiContext();

  const [totalSavings, setTotalSavings] = useState<string>("0.00");
  const [totalIncomes, setTotalIncomes] = useState<string>("0.00");
  const [totalExpenses, setTotalExpenses] = useState<string>("0.00");

  useEffect(() => {
    setTotalSavings(calculateMonthlyGoalSavings(goals));
    setTotalIncomes(calculateTotal(incomes));
    setTotalExpenses(calculateTotal(expenses));
  }, [goals, incomes, expenses]);

  const isIncomeOrExpenseRowEmpty = (row: IncomeRow | ExpenseRow) => {
    const nameEmpty = row.name.trim() === "";
    const categoryEmpty = row.category.trim() === "";
    const amountNum =
      typeof row.amount === "number"
        ? row.amount
        : parseFloat(String(row.amount));
    const amountZeroOrEmpty = isNaN(amountNum) || amountNum === 0;
    return nameEmpty && categoryEmpty && amountZeroOrEmpty;
  };

  const isGoalRowEmpty = (row: GoalRow) => {
    const goalEmpty = row.goal.trim() === "";
    const yearNum = Number(row.year);
    const amountNum = Number(row.amount);
    const yearZeroOrInvalid = isNaN(yearNum) || yearNum <= 0;
    const amountZeroOrInvalid = isNaN(amountNum) || amountNum <= 0;
    return goalEmpty && yearZeroOrInvalid && amountZeroOrInvalid;
  };

  const handleCalculate = async () => {
    try {
      const cleanedIncomes = incomes.filter(
        (i) => !isIncomeOrExpenseRowEmpty(i),
      );
      const cleanedExpenses = expenses.filter(
        (e) => !isIncomeOrExpenseRowEmpty(e),
      );
      const cleanedGoals = goals.filter((g) => !isGoalRowEmpty(g));

      const supportedCurrencies = ["PLN"];
      const effectiveCurrency = supportedCurrencies.includes(currency)
        ? currency
        : "PLN";

      const payload = getCalculationPayload(
        {
          userId: 1,
          incomes: { rows: cleanedIncomes },
          expenses: { rows: cleanedExpenses },
          goals: { rows: cleanedGoals },
        },
        effectiveCurrency,
      );

      console.debug("Sending calculation payload:", payload);

      const response = await sendCalculationToApi(payload);
      setResult(response);
    } catch (err: any) {
      if (err?.response) {
        console.error("Calculation API error response:", err.response);
      } else {
        console.error("Calculation error:", err);
      }
      setResult(null);
    }
  };

  const getClassName = () => {
    const id = result?.financialLevel?.id;
    if (id === 1) return "financial-level-too-low";
    if (id === 2) return "financial-level-optimal";
    if (id === 3) return "financial-level-excellent";
    return "";
  };

  return (
    <Card text="light" className="body-page shadow-sm custom-green-card py4">
      <Card.Header as="h3" className="text-center mb-2">
        SUMMARY
      </Card.Header>
      <Card.Subtitle className="text-center">
        Your monthly finances:
      </Card.Subtitle>

      <Card.Body className="mt-3">
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
            <Form>
              <Form.Group as={Row} className="sum-section">
                <Form.Label column xs={12} sm={7}>
                  Total savings for goals:
                </Form.Label>
                <Col xs={12} sm={5}>
                  <Form.Control
                    readOnly
                    value={formatCurrency(totalSavings, currency, locale)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="sum-section">
                <Form.Label column xs={12} sm={7}>
                  Total incomes:
                </Form.Label>
                <Col xs={12} sm={5}>
                  <Form.Control
                    readOnly
                    value={formatCurrency(totalIncomes, currency, locale)}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="sum-section">
                <Form.Label column xs={12} sm={7}>
                  Total expenses:
                </Form.Label>
                <Col xs={12} sm={5}>
                  <Form.Control
                    readOnly
                    value={formatCurrency(totalExpenses, currency, locale)}
                  />
                </Col>
              </Form.Group>
            </Form>
          </div>

          <div style={{ flex: "1 1 200px", maxWidth: "700px" }}>
            <Container fluid className="text-center mb-4 mt-4">
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-4">
                <Button
                  className="custom-gold-button text-light px-4 py-2 mt-4"
                  onClick={handleCalculate}
                >
                  Calculate your financial level
                </Button>
              </div>
            </Container>
          </div>

          <div className="result-section" style={{ flex: "1 1 700px" }}>
            <h2>Your financial level is:</h2>
            {result ? (
              <>
                <h4 className={getClassName()}>{result.financialLevel.name}</h4>
                <p>{result.financialLevel.text}</p>
                <p className={getClassName()}>
                  Monthly gap:{" "}
                  {formatCurrency(
                    result.financialLevel.missingAmount.toString(),
                    currency,
                    locale,
                  )}
                </p>
                <p className={getClassName()}>
                  Current surplus:{" "}
                  {formatCurrency(
                    result.financialLevel.surplusAmount.toString(),
                    currency,
                    locale,
                  )}
                </p>
              </>
            ) : (
              <p className="text-muted">
                Please click the button to calculate.
              </p>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Summary;
