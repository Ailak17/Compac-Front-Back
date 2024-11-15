import React, { useState } from 'react';
import axios from 'axios';
import Personas from '../components/Personas';
import Vehiculos from '../components/Vehiculos';
import Deposito from '../components/Deposito';
import '../styles/pages/cargadeacta.css';


const CargaDeActa = () => {
  const [acta, setActa] = useState({
    fecha: '',
    lugar: '',
    deposito_id: '',
    testigo_id: '',
    responsable_dao_id: '',
    responsable_policial_id: '',
    vehiculos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehiculosChange = (vehiculo) => {
    setActa((prev) => ({
      ...prev,
      vehiculos: [...prev.vehiculos, vehiculo],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // verifica que no este vacio el array de vehiculos
    if (acta.vehiculos.length === 0) {
      alert('Debe agregar al menos un vehículo.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/actas/crear/', acta, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log('Acta creada:', response.data);
    } catch (error) {
      console.error('Error al crear acta:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form className='ca' onSubmit={handleSubmit}>
      <div>
        <label>Fecha:</label>
        <input
          type="datetime-local"
          name="fecha"
          value={acta.fecha}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Lugar:</label>
        <input
          type="text"
          name="lugar"
          value={acta.lugar}
          onChange={handleChange}
          required
        />
      </div>

      <Deposito onSelect={(id) => setActa((prev) => ({ ...prev, deposito_id: id }))} />
      <h2>Responsable de la empresa compactadora</h2>
      <Personas onSelect={(id) => setActa((prev) => ({ ...prev, testigo_id: id }))} />
        <h2>Responsable de D.A.O</h2>
      <Personas onSelect={(id) => setActa((prev) => ({ ...prev, responsable_dao_id: id }))} />
        <h2>Responsable policial del predio</h2>
      <Personas onSelect={(id) => setActa((prev) => ({ ...prev, responsable_policial_id: id }))} />
      <Vehiculos onAddVehiculo={handleVehiculosChange} />

      {/* Muestra que vehiculos ya cargo */}
      <div>
        <h3>Vehículos Cargados</h3>
        {acta.vehiculos.length > 0 ? (
          <ul>
            {acta.vehiculos.map((vehiculo, index) => (
              <li key={index}>
                <p>Nro RUVS: {vehiculo.nro_ruvs}</p>
                <p>Dominio: {vehiculo.dominio}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay vehículos cargados.</p>
        )}
      </div>

      <button type="submit">Crear Acta</button>
    </form>
  );
};

export default CargaDeActa;
