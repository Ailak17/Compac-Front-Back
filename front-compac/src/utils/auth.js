export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  export const isAuthenticated = () => {
    const token = getAuthToken();
    if (!token) return false;
    // Agregar lógica para verificar la expiración del token si es necesario
    return true;
  };
  