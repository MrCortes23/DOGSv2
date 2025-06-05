export function getUserDataFromCookie() {
  const cookies = document.cookie.split('; ');
  const userCookie = cookies.find(cookie => cookie.startsWith('user='));

  if (!userCookie) {
    console.log('No se encontró cookie de usuario');
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
      console.log('Usuario inválido:', userData);
      return null;
    }

    console.log('Datos del usuario:', normalizedUserData);
    return normalizedUserData;
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error);
    return null;
  }
}
