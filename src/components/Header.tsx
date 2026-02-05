import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./../App.css";

export const Header = () => {
  const location = useLocation();

  return (
    <Navbar className="navbar-expand-xl px-3">
      <Container className="d-flex flex-column align-items-center">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="w-100">
          <Nav className="mx-auto" activeKey={location.pathname}>
            <Nav.Link as={Link} to="/app" eventKey="/app">
              App
            </Nav.Link>
            <Nav.Link as={Link} to="/about" eventKey="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
