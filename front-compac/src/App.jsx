import "./App.css";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Cambié a Routes
import CrearUsuario from './pages/CrearUsuario';
import Home from './pages/Home';
import InicioSesion from './pages/login';
import Navbar from './components/NavBar';
import { Navigate } from 'react-router-dom'; // Importa Navigate
import CargaDeActa from "./pages/CargaDeActa";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un token almacenado
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes> 
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <InicioSesion setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/create-user" element={isAuthenticated ? <Navigate to="/" /> : <CrearUsuario />} />
        <Route path="/cargadeacta" element={<PrivateRoute><CargaDeActa /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;