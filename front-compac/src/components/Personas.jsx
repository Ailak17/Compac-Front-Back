import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Personas = ({ onSelect }) => {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPersona, setNewPersona] = useState({ nombre: '', apellido: '', dni: '' });

  // Obtener el token desde el localStorage o de otro lugar
  const token = localStorage.getItem('access_token');

  // Cargar personas al montar el componente
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/personas/', {
        headers: {
          'Authorization': `Bearer ${token}` // Agregar el token en el encabezado
        }
      });
      setPersonas(response.data);
    } catch (error) {
      console.error('Error al obtener personas:', error);
    }
  };

  const handleSelectChange = (e) => {
    const personaId = e.target.value;
    setSelectedPersona(personaId);
    onSelect(personaId);  // Llama a la función onSelect con el ID seleccionado
  };

  const handleNewPersonaChange = (e) => {
    const { name, value } = e.target;
    setNewPersona({ ...newPersona, [name]: value });
  };

  const handleCreatePersona = async () => {
    try {
      const response = await axios.post('http://localhost:8000/personas/crear/', newPersona, {
        headers: {
          'Authorization': `Bearer ${token}` // Agregar el token en el encabezado
        }
      });
      console.log('Persona creada:', response.data);
      setIsCreating(false);
      fetchPersonas();  // Actualiza la lista de personas después de crear una nueva
      setNewPersona({ nombre: '', apellido: '', dni: '' });  // Limpia los campos de entrada
    } catch (error) {
      console.error('Error al crear persona:', error);
    }
  };

  return (
    <div>
      <label>Seleccionar Persona:</label>
      <select value={selectedPersona} onChange={handleSelectChange}>
        <option value="">Selecciona una persona</option>
        {personas.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.nombre} {persona.apellido} - DNI: {persona.dni}
          </option>
        ))}
      </select>
      <button onClick={() => setIsCreating(!isCreating)}>
        {isCreating ? 'Cancelar' : 'Crear Nueva Persona'}
      </button>

      {isCreating && (
        <div>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              name="nombre" 
              value={newPersona.nombre} 
              onChange={handleNewPersonaChange} 
              required 
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input 
              type="text" 
              name="apellido" 
              value={newPersona.apellido} 
              onChange={handleNewPersonaChange} 
              required 
            />
          </div>
          <div>
            <label>DNI:</label>
            <input 
              type="text" 
              name="dni" 
              value={newPersona.dni} 
              onChange={handleNewPersonaChange} 
              required 
            />
          </div>
          <button onClick={handleCreatePersona}>Guardar Persona</button>
        </div>
      )}
    </div>
  );
};

export default Personas;
