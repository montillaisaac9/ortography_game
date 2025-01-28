'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../../../models/AuthScheme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Estado de éxito
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false); // Resetear estado de éxito antes de enviar

    // Validación en cliente con Zod
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase(), password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        router.push('/dashboard'); // Redirige al dashboard o a la página principal
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Ocurrió un error inesperado. Inténtelo de nuevo más tarde.');
      } else {
        setError('Ocurrió un error inesperado. Inténtelo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h1>

        {/* Modal de notificación */}
        {(error || success) && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              success ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <p className="text-white">
              {success ? 'Login exitoso.' : error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
          <p>
            ¿No tienes cuenta?{' '}
            <Link className="text-blue-600" href="/pages/auth/register">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
