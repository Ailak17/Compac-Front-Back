import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Llama a la API para obtener los usuarios (asumiendo que la API ya está configurada)
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  return (
    <div>
      <h3>Lista de Usuarios</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
