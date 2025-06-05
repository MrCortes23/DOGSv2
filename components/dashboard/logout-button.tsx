'use client';

export default function LogoutButton() {

  const handleLogout = async () => {
    try {
      // Opcional: Hacer una llamada al servidor para invalidar la sesión
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Limpiar todas las cookies relacionadas con la autenticación
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Eliminar la cookie configurando su fecha de expiración en el pasado
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }

      // Limpiar el almacenamiento local y de sesión
      localStorage.clear();
      sessionStorage.clear();

      // Forzar una recarga completa para limpiar el estado de la aplicación
      window.location.href = '/';
      
      // Opcional: Redirigir usando el router de Next.js
      // router.push('/');
      // router.refresh(); // Forzar recarga del cliente
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Asegurarse de redirigir incluso si hay un error
      window.location.href = '/';
    }
  };

  return (
    <button
      type="button"
      className="w-full flex items-center justify-between p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
      onClick={handleLogout}
    >
      <span>Cerrar Sesión</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  );
}
