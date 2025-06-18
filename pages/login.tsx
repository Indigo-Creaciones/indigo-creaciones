import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validación de credenciales según el Readme
    if (
      credentials.username === 'IndigoCreaciones' &&
      credentials.password === 'Indigo.Creaciones@2025'
    ) {
      // TODO: Implementar JWT o session storage
      localStorage.setItem('isAdmin', 'true')
      router.push('/admin')
    } else {
      setError('Usuario o contraseña incorrectos')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terra-50 via-terra-100 to-terra-200 flex flex-col">
      <Head>
        <title>Login Administrativo - Indigo Creaciones</title>
        <meta name="description" content="Panel de administración de Indigo Creaciones" />
      </Head>

      {/* Header */}
      <header className="bg-terra-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/icon.webp" alt="Indigo Creaciones" width={40} height={40} style={{width: '40px', height: '40px'}} />
            <span className="text-terra-700 font-playfair text-xl">Indigo Creaciones</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-8 px-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 border border-terra-100"
        >
          <div className="flex flex-col items-center mb-8">
            <Image src="/icon.webp" alt="Indigo Creaciones" width={60} height={60} className="mb-2" style={{width: '60px', height: '60px'}} />
            <h1 className="text-3xl font-playfair text-terra-700 mb-1">Login Administrativo</h1>
            <p className="text-terra-600 text-sm">Acceso exclusivo para administradores</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-terra-700 mb-1 font-medium">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  required
                  autoComplete="username"
                  className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-400 bg-terra-50 text-terra-800 placeholder-terra-400 transition-all shadow-sm"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Usuario"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-terra-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-terra-700 mb-1 font-medium">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  autoComplete="current-password"
                  className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-400 bg-terra-50 text-terra-800 placeholder-terra-400 transition-all shadow-sm pr-10"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none transition-colors border-2 ${showPassword ? 'border-terra-700 bg-terra-100' : 'border-terra-300 bg-white'} shadow-sm`}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-terra-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-terra-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-terra-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-terra-600 transition-all flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              )}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
