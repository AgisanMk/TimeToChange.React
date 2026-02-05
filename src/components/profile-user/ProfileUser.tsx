import { Container, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { useApiContext } from "../../context/apiContext";
import { handleChangeFactory } from "./profile-user.logic";

const calculationNumbers = ["1", "2", "3"];

const ProfileUser = () => {
  const { loadingCountries, countryOptions, profileState, dispatch } =
    useApiContext();

  const state = profileState;
  const handleProfileChange = handleChangeFactory(dispatch);

  return (
    <Container className="profile-user py-3">
      <Card text="light" className="shadow-sm custom-green-card">
        <Card.Header as="h5" className="text-center mb-2">
          Profile User
        </Card.Header>
        <Card.Subtitle className="text-center mb-3">
          Please set your settings:
        </Card.Subtitle>
        <Card.Body>
          <Form className="text-start mx-1">
            {/* Name */}
            <Form.Group
              as={Row}
              controlId="Name"
              className="align-items-center mb-3"
            >
              <Form.Label column xs={4}>
                User:
              </Form.Label>
              <Col xs={8}>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Enter your name"
                  value={state.name}
                  isInvalid={!!state.errors.name}
                  onChange={(e) => handleProfileChange("name", e)}
                />
                <Form.Control.Feedback type="invalid">
                  {state.errors.name}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Calculation No. */}
            <Form.Group
              as={Row}
              controlId="CalculationNo"
              className="align-items-center mb-2"
            >
              <Form.Label column xs={6}>
                Calculation no.:
              </Form.Label>
              <Col xs={6}>
                <Form.Select
                  size="sm"
                  value={state.calcNumber}
                  isInvalid={!!state.errors.calcNumber}
                  onChange={(e) => handleProfileChange("calcNumber", e)}
                >
                  <option value="">--Select--</option>
                  {calculationNumbers.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {state.errors.calcNumber}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Country */}
            <Form.Group
              as={Row}
              controlId="Country"
              className="align-items-center mb-2"
            >
              <Form.Label column xs={6}>
                Country:
              </Form.Label>
              <Col xs={6}>
                <Form.Select
                  size="sm"
                  value={state.country}
                  isInvalid={!!state.errors.country}
                  onChange={(e) => handleProfileChange("country", e)}
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries ? "Loading..." : "--Select--"}
                  </option>
                  {countryOptions.map((country) => (
                    <option key={country.cca2} value={country.cca2}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
                {loadingCountries && (
                  <Spinner
                    animation="border"
                    size="sm"
                    className="ms-2 text-light"
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {state.errors.country}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            {/* Currency */}
            <Form.Group
              as={Row}
              controlId="Currency"
              className="align-items-center"
            >
              <Form.Label column xs={6}>
                Currency:
              </Form.Label>
              <Col xs={6}>
                <Form.Select
                  size="sm"
                  value={state.currency}
                  isInvalid={!!state.errors.currency}
                  onChange={(e) => handleProfileChange("currency", e)}
                >
                  <option value="">--Select--</option>
                  {state.currencyOptions.map((cur) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {state.errors.currency}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileUser;
