import "./App.css";
import { Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Calculation from "./pages/Calculation";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route index element={<Calculation />} />
          <Route path="/app" element={<Calculation />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <Navbar
          className="d-flex flex-column align-items-center px-3"
          style={{ backgroundColor: "#f8f9fa" }}
          variant="light"
        >
          <p>© 2026 Agnieszka Makowej | All Rights Reserved.</p>
        </Navbar>
      </footer>
    </Router>
  );
}

export default App;
