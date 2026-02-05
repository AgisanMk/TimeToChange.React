import React from "react";
import logo from "../assets/logo.png";

import { Button, Container, Spinner } from "react-bootstrap";

import { ApiProvider, useApiContext } from "../context/apiContext";
import { useProfileSetup } from "../components/profile-user/profile-user.logic.ts";

import ProfileUser from "../components/profile-user/ProfileUser";
import Goals from "../components/goals/Goals";
import Expenses from "../components/expenses/Expenses";
import Incomes from "../components/incomes/Incomes";
import Summary from "../components/summary/Summary";

import {
  goalsReducer,
  initialGoalsState,
} from "../components/goals/goals.logic.ts";
import {
  incomesReducer,
  initialIncomesState,
} from "../components/incomes/incomes.logic.ts";
import {
  expensesReducer,
  initialExpensesState,
} from "../components/expenses/expenses.logic.ts";

import type { CalculationResult } from "../types/types.ts";

const InnerCalculation = () => {
  const { dispatch: profileDispatch, resetProfileContext } = useApiContext();
  const { loading } = useProfileSetup(profileDispatch);

  const [goalsState, goalsDispatch] = React.useReducer(
    goalsReducer,
    initialGoalsState,
  );
  const [expensesState, expensesDispatch] = React.useReducer(
    expensesReducer,
    initialExpensesState,
  );
  const [incomesState, incomesDispatch] = React.useReducer(
    incomesReducer,
    initialIncomesState,
  );

  const [result, setResult] = React.useState<CalculationResult | null>(null);
  const [resetSignal, setResetSignal] = React.useState(false);

  // Clear all related sessionStorage keys
  const clearAllSessionStorage = () => {
    sessionStorage.removeItem("goals");
    sessionStorage.removeItem("incomes");
    sessionStorage.removeItem("expenses");
  };

  const handleClearAll = () => {
    clearAllSessionStorage();
    goalsDispatch({ type: "RESET" });
    expensesDispatch({ type: "RESET" });
    incomesDispatch({ type: "RESET" });
    resetProfileContext();

    setResult(null);
    setResetSignal(true);
  };

  React.useEffect(() => {
    if (resetSignal) {
      const timeout = setTimeout(() => setResetSignal(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [resetSignal]);

  return (
    <Container fluid className="body-page mt-4 mb-4">
      <div className="text-center">
        <h1>Time to Change</h1>
        <img src={logo} alt="logo" className="logo mb-3" />
        <h3>Achieve your dream goals!</h3>
        <p>
          Maybe it's time to change your current financial plan.
          <br />
          With this digital spreadsheet, you’ll see how close you are to reaching your goal.
        </p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center w-100 my-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <div
              style={{ flex: "1 1 600px", maxWidth: "700px" }}
              className="d-flex flex-column align-items-center gap-4"
            >
              <ProfileUser />
              <div className="d-flex flex-column flex-md-row gap-3 mt-2">
                <Button
                  className="custom-green-button"
                  onClick={() => {
                    incomesDispatch({ type: "LOAD_DEFAULTS" });
                    expensesDispatch({ type: "LOAD_DEFAULTS" });
                  }}
                >
                  Use default categories
                </Button>
                <Button
                  className="custom-green-button"
                  onClick={handleClearAll}
                >
                  Clear all fields
                </Button>
              </div>
            </div>

            <div style={{ flex: "1 1 600px", maxWidth: "700px" }}>
              <Goals
                goals={goalsState.rows}
                dispatch={goalsDispatch}
                resetSignal={resetSignal}
              />
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between gap-2">
            <div style={{ flex: "1 1 600px", maxWidth: "700px" }}>
              <Incomes
                incomes={incomesState.rows}
                dispatch={incomesDispatch}
                resetSignal={resetSignal}
              />
            </div>
            <div style={{ flex: "1 1 600px", maxWidth: "700px" }}>
              <Expenses
                expenses={expensesState.rows}
                dispatch={expensesDispatch}
                resetSignal={resetSignal}
              />
            </div>
          </div>

          <Summary
            goals={goalsState.rows}
            expenses={expensesState.rows}
            incomes={incomesState.rows}
            result={result}
            setResult={setResult}
          />
        </>
      )}
    </Container>
  );
};

const Calculation = () => (
  <ApiProvider>
    <InnerCalculation />
  </ApiProvider>
);

export default Calculation;
