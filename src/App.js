import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Categoria from "./components/Categoria";
import Produto from "./components/Produto";
import Nav from 'react-bootstrap/Nav';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav variant="tabs">
        <Nav.Item>
          <Nav.Link as={Link} to="/categoria">Categoria</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/produto">Produto</Nav.Link>
        </Nav.Item>
      </Nav>
      <Routes>
        <Route path="/categoria" element={<Categoria/>}></Route>
        <Route path="/produto" element={<Produto/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
