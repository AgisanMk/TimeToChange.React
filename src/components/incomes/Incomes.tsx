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
import { calculateIncomeTotals, persistIncomes } from "./incomes.logic";
import type { IncomeRow, IncomesProps } from "../../types/types";
import { useApiContext } from "../../context/apiContext.tsx";
import { formatCurrency } from "../../utils/formatCurrency.ts";

const Incomes = ({ resetSignal, incomes, dispatch }: IncomesProps) => {
  const { currency, locale } = useApiContext();

  const totals = calculateIncomeTotals(incomes);

  // Persist incomes to sessionStorage on incomes change
  useEffect(() => {
    persistIncomes(incomes);
  }, [incomes]);

  // React to external resetSignal
  useEffect(() => {
    if (resetSignal) {
      dispatch({ type: "RESET" });
    }
  }, [resetSignal, dispatch]);

  const handleInputChange = (
    id: string,
    field: keyof Omit<IncomeRow, "errors" | "id">,
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
      <Card border="light" text="light" className="shadow-sm custom-blue-card">
        <Card.Header as="h3" className="text-center mb-2">
          INCOMES
        </Card.Header>
        <Card.Subtitle className="text-center">
          Enter your monthly incomes:
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
                      <th className="text-light">Income</th>
                      <th className="text-light">Category</th>
                      <th className="text-light">Amount</th>
                      <th className="text-light"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((row, i) => (
                      <tr key={row.id}>
                        <td className="text-center align-content-center small">
                          {i + 1}.
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Enter an income name"
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
                            <option value="passive">Passive</option>
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
                            inputMode="decimal"
                            placeholder=""
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
            {(["fixed", "variable", "passive"] as const).map((type) => (
              <React.Fragment key={type}>
                <Col xs={12} sm={8}>
                  <Form.Label className="text-light">
                    Sum {type} incomes:
                  </Form.Label>
                </Col>
                <Col xs={12} sm={4}>
                  <Form.Control
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

export default Incomes;
