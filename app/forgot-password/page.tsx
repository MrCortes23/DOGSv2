import ForgotPasswordForm from '@/components/auth/forgot-password-form'

export const metadata = {
  title: 'Recuperar contraseña',
  description: 'Recupera tu contraseña de acceso',
  robots: 'noindex, nofollow' // Evitar indexación
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Guardería Canina DOGS</h1>
          <p className="mt-2 text-sm text-gray-600">Recupera el acceso a tu cuenta</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
