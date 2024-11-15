import React from 'react';


const Home = () => {
  return (
    <div style={{margin:"4%"}} className="home-container">
      <header>
        <h1>Bienvenido al sistema de compactaciones </h1>
        <h1>de la Provincia De Buenos aires</h1>
      </header>

      <main>
        <section className="dashboard">
          <h2>Panel de Control</h2>
          <p>Aquí puedes cargar las actas corresconpientes a la compactacion de 2024.</p>
          {/* Puedes agregar más secciones, widgets o componentes aquí */}
        </section>

        
      </main>

      <footer>
        <p>&copy; 2024 - Provincia de Buenos Aires- Secretaria General </p>
      </footer>
    </div>
  );
};

export default Home;
