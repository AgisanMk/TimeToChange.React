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
import { calculateGoalTotals, serializeGoals } from "./goals.logic.ts";
import type { GoalRow, GoalsProps } from "../../types/types";
import { useApiContext } from "../../context/apiContext.tsx";
import { formatCurrency } from "../../utils/formatCurrency.ts";
import { useEffect } from "react";

const Goals = ({ resetSignal, goals, dispatch }: GoalsProps) => {
  const { currency, locale } = useApiContext();
  const totals = calculateGoalTotals(goals);

  useEffect(() => {
    sessionStorage.setItem("goals", JSON.stringify(serializeGoals(goals)));
  }, [goals]);

  useEffect(() => {
    if (resetSignal) {
      dispatch({ type: "RESET" });
    }
  }, [resetSignal, dispatch]);

  const handleInputChange = (
    id: string,
    field: keyof Omit<GoalRow, "errors" | "id">,
    value: string,
  ) => {
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
      <Card className="custom-gold-card shadow-sm">
        <Card.Header as="h3" className="text-center mb-2">
          Goals
        </Card.Header>
        <Card.Subtitle className="text-center mb-3">
          Enter goals to be achieved in a certain number of years:
        </Card.Subtitle>

        <Card.Body>
          <Row className="g-4">
            <Col xs={12}>
              <div className="table-responsive">
                <Table
                  striped
                  bordered
                  hover
                  className="overflow-auto custom-gold-card-table"
                  style={{ tableLayout: "fixed", minWidth: "300px" }}
                >
                  <colgroup>
                    <col style={{ width: "9%" }} />
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "17%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "14%" }} />
                  </colgroup>
                  <thead>
                    <tr className="small">
                      <th className="text-light">No.</th>
                      <th className="text-light">Goal</th>
                      <th className="text-light">Years</th>
                      <th className="text-light">Amount</th>
                      <th className="text-light"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((row, i) => (
                      <tr key={row.id}>
                        <td className="text-center align-content-center small">
                          {i + 1}.
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Enter your dream goal"
                            value={row.goal}
                            isInvalid={!!row.errors.goal}
                            onChange={(e) =>
                              handleInputChange(row.id, "goal", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {row.errors.goal}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            placeholder="0"
                            min={1}
                            className="amountCell"
                            value={row.year}
                            isInvalid={!!row.errors.year}
                            onChange={(e) =>
                              handleInputChange(row.id, "year", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {row.errors.year}
                          </Form.Control.Feedback>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            placeholder="0"
                            min={0}
                            step="1"
                            className=""
                            value={row.amount}
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
                            className="btn-sm custom-gold-button"
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
                  <Button className="custom-gold-button" onClick={handleReset}>
                    Reset all
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer>
          <Form.Group as={Row} className="sum-section">
            <Form.Label column xs={12} sm={8} className="text-light">
              Sum target goals:
            </Form.Label>
            <Col xs={12} sm={4}>
              <Form.Control
                type="text"
                readOnly
                value={formatCurrency(totals.totalAmount, currency, locale)}
              />
            </Col>
            <Form.Label column xs={12} sm={8} className="text-light">
              Monthly sum to save:
            </Form.Label>
            <Col xs={12} sm={4}>
              <Form.Control
                type="text"
                readOnly
                value={formatCurrency(totals.totalMonthly, currency, locale)}
              />
            </Col>
          </Form.Group>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Goals;
