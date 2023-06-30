import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navigation from "./components/Navigation";
import Todos from "./pages/Todos";
import { Box } from "@chakra-ui/react";
import { loginAtom } from "./Atoms";
import { useAtom } from "jotai";
function App() {
  const [login, setLogin] = useAtom(loginAtom);
  return (
    <Router>
      <Box pos="relative" minHeight="100vh">
        {login && <Navigation />}
        <Box>
          <Routes>
            <Route path="/" exact element={login ? <Todos /> : <Home />} />
            <Route path="/todos" element={login ? <Todos /> : <Home />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
