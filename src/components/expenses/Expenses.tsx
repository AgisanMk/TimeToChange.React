import React, { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import "../../App.css";
import { calculateExpenseTotals, persistExpenses } from "./expenses.logic";
import type { ExpenseRow, ExpensesProps } from "../../types/types";
import { useApiContext } from "../../context/apiContext.tsx";
import { formatCurrency } from "../../utils/formatCurrency.ts";

export const Expenses = ({
  resetSignal,
  expenses,
  dispatch,
}: ExpensesProps) => {
  const { currency, locale } = useApiContext();

  const totals = calculateExpenseTotals(expenses);

  // Persist expenses to sessionStorage on expenses change
  useEffect(() => {
    persistExpenses(expenses);
  }, [expenses]);

  // React to external resetSignal
  useEffect(() => {
    if (resetSignal) {
      dispatch({ type: "RESET" });
    }
  }, [resetSignal, dispatch]);

  const handleInputChange = (
    id: string,
    field: keyof Omit<ExpenseRow, "errors" | "id">,
    value: string,
  ) => {
    // We pass the raw string — the parsing and validation logic is in the reducer
    dispatch({
      type: "UPDATE_AND_VALIDATE_ROW",
      payload: { id, field, value },
    });
  };

  const handleAddRow = () => dispatch({ type: "ADD_ROW" });
  const handleDeleteRow = (id: string) =>
    dispatch({ type: "DELETE_ROW", payload: id });
  const handleReset = () => dispatch({ type: "RESET" });

  return (
    <Container className="mb-4 mt-4">
      <Card className="custom-blue-card shadow-sm">
        <Card.Header as="h3" className="text-center mb-2">
          EXPENSES
        </Card.Header>
        <Card.Subtitle className="text-center">
          Enter your monthly expenses:
        </Card.Subtitle>

        <Card.Body>
          <Row className="g-4">
            <Col xs={12}>
              <div className="table-responsive">
                <Table
                  striped
                  bordered
                  hover
                  className="overflow-auto custom-blue-card-table"
                  style={{ tableLayout: "fixed", minWidth: "300px" }}
                >
                  <colgroup>
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "34%" }} />
                    <col style={{ width: "23%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "14%" }} />
                  </colgroup>
                  <thead>
                    <tr className="small">
                      <th className="text-light">No.</th>
                      <th className="text-light">Expense</th>
                      <th className="text-light">Category</th>
                      <th className="text-light">Amount</th>
                      <th className="text-light"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((row, i) => (
                      <tr key={row.id}>
                        <td className="text-center align-content-center small">
                          {i + 1}.
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Enter an expense name"
                            value={row.name}
                            isInvalid={!!row.errors.name}
                            onChange={(e) =>
                              handleInputChange(row.id, "name", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {row.errors.name}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={row.category}
                            isInvalid={!!row.errors.category}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "category",
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Choose...</option>
                            <option value="fixed">Fixed</option>
                            <option value="variable">Variable</option>
                            <option value="occasional">Occasional</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {row.errors.category}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            min={0}
                            step="1"
                            value={
                              typeof row.amount === "number"
                                ? row.amount.toString()
                                : row.amount
                            }
                            isInvalid={!!row.errors.amount}
                            onChange={(e) =>
                              handleInputChange(
                                row.id,
                                "amount",
                                e.target.value,
                              )
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {row.errors.amount}
                          </Form.Control.Feedback>
                        </td>
                        <td className="text-center">
                          <Button
                            className="btn-sm custom-blue-button"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-between w-100">
                  <Button className="btn-light" onClick={handleAddRow}>
                    Add row
                  </Button>

                  <Button className="custom-blue-button" onClick={handleReset}>
                    Reset all
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer>
          <Form.Group as={Row} className="sum-section">
            {(["fixed", "variable", "occasional"] as const).map((type) => (
              <React.Fragment key={type}>
                <Col xs={12} sm={8}>
                  <Form.Label className="text-light">
                    Sum {type} expenses:
                  </Form.Label>
                </Col>
                <Col xs={12} sm={4}>
                  <Form.Control
                    className="text-end"
                    type="text"
                    readOnly
                    value={formatCurrency(totals[type], currency, locale)}
                  />
                </Col>
              </React.Fragment>
            ))}
          </Form.Group>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Expenses;
