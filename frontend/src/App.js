import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/home";
import { Cadastro } from "./pages/cadastro";
import { Login } from "./pages/login";
import { Menu } from "./pages/menu";
import React from "react";
const isAuth = () => {
  return localStorage.getItem("auth") === "true";
};

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  return isAuth() ? children : <Navigate to="/menu" replace />;
}

function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/cadastro" element={<Cadastro />} />
  <Route path="/login" element={<Login />} />
  <Route path="/eventos" element={
      <PrivateRoute>
        <Menu />
      </PrivateRoute>
    } 
  />
  <Route path="/menu" element={<Menu/>} />
  
</Routes>

    </BrowserRouter>
  );
}

export default App;
