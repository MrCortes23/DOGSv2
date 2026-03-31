// app/reset-password/page.tsx
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata = {
  title: 'Restablecer contraseña',
  description: 'Restablece tu contraseña de acceso',
  robots: 'noindex, nofollow'
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Guardería Canina DOGS</h1>
          <p className="mt-2 text-sm text-gray-600">Restablece tu contraseña</p>
        </div>
        <Suspense fallback={<div className="flex flex-col items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div><p>Verificando enlace...</p></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}