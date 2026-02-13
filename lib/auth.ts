type UserData = {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: string;
};

export function getUserDataFromCookie(): UserData | null {
  const cookies = document.cookie.split('; ');
  const userCookie = cookies.find(cookie => cookie.startsWith('user='));

  if (!userCookie) {
    return null;
  }

  try {
    const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    
    // Asegurarse de que todos los campos existan
    const normalizedUserData = {
      id: userData.id,
      nombre: userData.nombre || '',
      correo: userData.correo || '',
      telefono: userData.telefono || '',
      direccion: userData.direccion || '',
      rol: userData.rol || 'cliente'
    };

    if (!normalizedUserData.id) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Usuario inválido');
      }
      return null;
    }

    return normalizedUserData;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al obtener datos de usuario:', error);
    }
    return null;
  }
}
