import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Necesario para enviar/recibir cookies
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas');
        return;
      }

      // Establecer la cookie de usuario en el cliente
      document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${60 * 60 * 24 * 7}; secure=false; samesite=strict`;

      // Redirigir según el rol
      router.push(data.user.rol === 'administrador' ? '/admin' : '/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(90vh-64px)]">
      <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="flex justify-center pt-6 pb-2">
          <Image 
            src="/images/logonegro.png" 
            alt="Logo Guardería Campestre DOGS" 
            width={150}
            height={64}
            className="h-16 w-auto"
            priority
          />
        </div>
        <div className="px-6 pb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Iniciar Sesión</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded border border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
              required
              placeholder="ejemplo@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded border border-gray-300 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2.5 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Regístrate aquí
              </a>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}