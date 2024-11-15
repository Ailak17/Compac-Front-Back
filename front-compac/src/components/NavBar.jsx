import "../styles/navbar.css";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Elimina el token de localStorage o cualquier dato de sesión
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);  // Actualiza el estado de autenticación
    navigate('/login');  // Redirige al login
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <img src="/images/logoblanco.png" width="200" alt="logo de la provincia"/>
        <h2>Sistema de Compactaciones </h2>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/cargadeacta">Carga de Acta</Link>
          </li>
        </ul>

        <div className="auth-section">
          {isAuthenticated ? (
            <button onClick={handleLogout}>Cerrar sesión</button>
          ) : (
            <Link to="/login"> </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
