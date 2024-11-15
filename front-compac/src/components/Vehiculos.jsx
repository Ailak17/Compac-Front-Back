import React, { useState } from 'react';
import axios from 'axios';

const Vehiculos = ({ onAddVehiculo }) => {
  const [vehiculo, setVehiculo] = useState({
    nro_ruvs: '',
    nro_cargo_policial: '',
    dominio: '',
    chasis_cuadro: '',
    motor: '',
    dependencia_policial: '',
    marca: '',
    modelo: '',
    tipo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehiculo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVehiculo = () => {
    if (
      vehiculo.nro_ruvs &&
      vehiculo.nro_cargo_policial &&
      vehiculo.dominio &&
      vehiculo.chasis_cuadro &&
      vehiculo.motor &&
      vehiculo.dependencia_policial &&
      vehiculo.marca &&
      vehiculo.modelo &&
      vehiculo.tipo
    ) {
      onAddVehiculo(vehiculo);
      setVehiculo({
        nro_ruvs: '',
        nro_cargo_policial: '',
        dominio: '',
        chasis_cuadro: '',
        motor: '',
        dependencia_policial: '',
        marca: '',
        modelo: '',
        tipo: ''
      }); // Limpiar los campos del vehículo
    } else {
      alert('Por favor complete todos los campos del vehículo.');
    }
  };

  return (
    <div>
      <h3>Agregar Vehículo</h3>
      <input
        type="text"
        name="nro_ruvs"
        value={vehiculo.nro_ruvs}
        onChange={handleChange}
        placeholder="Nro RUVS"
      />
      <input
        type="text"
        name="nro_cargo_policial"
        value={vehiculo.nro_cargo_policial}
        onChange={handleChange}
        placeholder="Nro Cargo Policial"
      />
      <input
        type="text"
        name="dominio"
        value={vehiculo.dominio}
        onChange={handleChange}
        placeholder="Dominio"
      />
      <input
        type="text"
        name="chasis_cuadro"
        value={vehiculo.chasis_cuadro}
        onChange={handleChange}
        placeholder="Chasis Cuadro"
      />
      <input
        type="text"
        name="motor"
        value={vehiculo.motor}
        onChange={handleChange}
        placeholder="Motor"
      />
      <input
        type="text"
        name="dependencia_policial"
        value={vehiculo.dependencia_policial}
        onChange={handleChange}
        placeholder="Dependencia Policial"
      />
      <input
        type="text"
        name="marca"
        value={vehiculo.marca}
        onChange={handleChange}
        placeholder="Marca"
      />
      <input
        type="text"
        name="modelo"
        value={vehiculo.modelo}
        onChange={handleChange}
        placeholder="Modelo"
      />
      <input
        type="text"
        name="tipo"
        value={vehiculo.tipo}
        onChange={handleChange}
        placeholder="Tipo"
      />
      <button type="button" onClick={handleAddVehiculo}>
        Agregar Vehículo
      </button>
    </div>
  );
};

export default Vehiculos;
