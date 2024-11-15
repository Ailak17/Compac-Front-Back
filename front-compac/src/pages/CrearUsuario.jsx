import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/crearuser.css'
const CrearUsuario = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      role,
    };

    try {
      const response = await fetch('http://localhost:8000/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Usuario creado con éxito');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Error desconocido');
        
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='inicios' style={{margin:"4%"}}>
      <h2>Crear Usuario</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className='inputs'
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input className='inputs'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input className='inputs'
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input className='inputs'
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input className='inputs'
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br/>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Rol</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Creando usuario...' : 'Crear Usuario'}
        </button>
      </form>
      <p>Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
    </div>
  );
};

export default CrearUsuario;
