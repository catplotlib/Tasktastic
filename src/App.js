import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";

import Navigation from "./components/Navigation";
import Todos from "./pages/Todos";
import { Box } from "@chakra-ui/react";
import { userAtom } from "./Atoms";
import { useAtom } from "jotai";
function App() {
  const [user, setUser] = useAtom(userAtom);
  return (
    <Router>
      <Box pos="relative" minHeight="100vh">
        {user && <Navigation />}
        <Box>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/todos" element={<Todos />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
