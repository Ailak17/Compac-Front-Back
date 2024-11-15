import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Deposito = ({ onSelect }) => {
  const [depositos, setDepositos] = useState([]);
  const [selectedDeposito, setSelectedDeposito] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newDeposito, setNewDeposito] = useState({ nombre: '', direccion: '' });

  // Obtener el token desde el localStorage o de otro lugar
  const token = localStorage.getItem('access_token');

  // Cargar los depósitos al montar el componente
  useEffect(() => {
    fetchDepositos();
  }, []);

  const fetchDepositos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/depositos/', {
        headers: {
          'Authorization': `Bearer ${token}` // Agregar el token en el encabezado
        }
      });
      setDepositos(response.data);
    } catch (error) {
      console.error('Error al obtener depósitos:', error);
    }
  };

  const handleSelectChange = (e) => {
    const depositoId = e.target.value;
    setSelectedDeposito(depositoId);
    onSelect(depositoId);  // Llama a la función onSelect con el ID seleccionado
  };

  const handleNewDepositoChange = (e) => {
    const { name, value } = e.target;
    setNewDeposito({ ...newDeposito, [name]: value });
  };

  const handleCreateDeposito = async () => {
    try {
      const response = await axios.post('http://localhost:8000/depositos/crear/', newDeposito, {
        headers: {
          'Authorization': `Bearer ${token}` // Agregar el token en el encabezado
        }
      });
      console.log('Depósito creado:', response.data);
      setIsCreating(false);
      fetchDepositos();  // Actualiza la lista de depósitos después de crear uno nuevo
      setNewDeposito({ nombre: '', direccion: '' });  // Limpia los campos de entrada
    } catch (error) {
      console.error('Error al crear depósito:', error);
    }
  };

  return (
    <div>
      <label>Seleccionar Depósito:</label>
      <select value={selectedDeposito} onChange={handleSelectChange}>
        <option value="">Selecciona un depósito</option>
        {depositos.map((deposito) => (
          <option key={deposito.id} value={deposito.id}>
            {deposito.nombre} - {deposito.direccion}
          </option>
        ))}
      </select>
      <button onClick={() => setIsCreating(!isCreating)}>
        {isCreating ? 'Cancelar' : 'Crear Nuevo Depósito'}
      </button>

      {isCreating && (
        <div>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              name="nombre" 
              value={newDeposito.nombre} 
              onChange={handleNewDepositoChange} 
              required 
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input 
              type="text" 
              name="direccion" 
              value={newDeposito.direccion} 
              onChange={handleNewDepositoChange} 
              required 
            />
          </div>
          <button onClick={handleCreateDeposito}>Guardar Depósito</button>
        </div>
      )}
    </div>
  );
};

export default Deposito;
