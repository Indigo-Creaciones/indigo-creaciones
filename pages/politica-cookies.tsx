import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function PoliticaCookies() {
  const [activeSection, setActiveSection] = useState('queson')
  
  const sections = [
    {
      id: 'queson',
      title: '¿Qué son las Cookies?',
      content: `Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo para:
        • Mejorar tu experiencia de navegación
        • Recordar tus preferencias
        • Proporcionar información relevante
        
        Estos archivos nos permiten reconocer tu dispositivo y recopilar información sobre cómo interactúas con nuestro sitio.`
    },
    {
      id: 'tipos',
      title: 'Tipos de Cookies que Usamos',
      content: `En Indigo Creaciones utilizamos los siguientes tipos de cookies:

        1. Cookies Esenciales:
        • Necesarias para el funcionamiento básico del sitio
        • Permiten la navegación y uso de funciones básicas

        2. Cookies de Rendimiento:
        • Recopilan información sobre cómo utilizas nuestro sitio
        • Nos ayudan a mejorar la funcionalidad del sitio

        3. Cookies de Funcionalidad:
        • Recuerdan tus preferencias y elecciones
        • Personalizan tu experiencia de navegación

        4. Cookies de Marketing (si has dado tu consentimiento):
        • Ayudan a mostrar anuncios relevantes
        • Miden la efectividad de nuestras campañas de marketing`
    },
    {
      id: 'proposito',
      title: 'Propósito y Duración',
      content: `Utilizamos cookies para:
        • Mantener tu sesión activa mientras navegas
        • Recordar tus preferencias de visualización
        • Analizar cómo se utiliza nuestro sitio
        • Mejorar nuestros servicios

        Duración de las cookies:
        • Cookies de sesión: se eliminan cuando cierras el navegador
        • Cookies persistentes: permanecen en tu dispositivo por un tiempo determinado`
    },
    {
      id: 'control',
      title: 'Control de Cookies',
      content: `Puedes controlar y gestionar las cookies de varias formas:

        1. Configuración del Navegador:
        • Puedes modificar la configuración de tu navegador para aceptar o rechazar cookies
        • Puedes eliminar las cookies existentes
        • Puedes configurar notificaciones cuando se instalen nuevas cookies

        2. Nuestro Sitio Web:
        • Puedes ajustar tus preferencias de cookies a través de nuestro banner de cookies
        • Puedes retirar tu consentimiento en cualquier momento

        3. Herramientas de Terceros:
        • Puedes utilizar herramientas de gestión de cookies de terceros
        • Puedes optar por no participar en el seguimiento de analytics`
    },
    {
      id: 'privacidad',
      title: 'Privacidad y Seguridad',
      content: `Nos comprometemos a:
        • Proteger la información recopilada a través de cookies
        • No compartir información personal identificable sin tu consentimiento
        • Mantener tus datos seguros y protegidos
        • Actualizar regularmente nuestras medidas de seguridad

        Para más información sobre cómo protegemos tus datos, consulta nuestra Política de Privacidad.`
    }
  ]

  return (
    <div className="min-h-screen bg-terra-50">
      <Head>
        <title>Política de Cookies - Indigo Creaciones</title>
        <meta name="description" content="Política de cookies de Indigo Creaciones" />
      </Head>

      {/* Header simplificado */}
      <header className="bg-terra-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.webp" alt="Indigo Creaciones" width={40} height={40} className="rounded-lg" style={{width: '40px', height: '40px'}} />
            <span className="text-terra-100 font-playfair text-xl">Indigo Creaciones</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair text-terra-700 mb-8 text-center">
            Política de Cookies
          </h1>
          
          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <p className="text-terra-600 text-lg leading-relaxed">
              Esta política explica cómo Indigo Creaciones utiliza cookies y tecnologías similares para mejorar 
              tu experiencia en nuestro sitio web. Al continuar navegando, aceptas el uso de cookies según 
              se describe en esta política.
            </p>
          </div>

          {/* Navegación de secciones */}
          <div className="flex flex-wrap gap-2 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-terra-600 text-white shadow-md transform -translate-y-0.5"
                    : "bg-white text-terra-600 hover:bg-terra-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Contenido de secciones */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`transition-all duration-500 ${
                  activeSection === section.id
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 absolute -translate-y-4 pointer-events-none"
                }`}
                style={{ display: activeSection === section.id ? "block" : "none" }}
              >
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-playfair text-terra-700 mb-4">{section.title}</h2>
                  <div className="prose prose-terra max-w-none">
                    {section.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="text-terra-600 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contacto y más información */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-playfair text-terra-700 mb-4">Más Información</h2>
            <p className="text-terra-600 leading-relaxed mb-4">
              Si tienes preguntas sobre nuestro uso de cookies o necesitas más información, 
              no dudes en contactarnos:
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-terra-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>indigo.creaciones76@gmail.com</span>
              </div>
              <div className="flex items-center text-terra-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Pedro Ferre 480, Bella Vista, Corrientes, Argentina</span>
              </div>
            </div>
          </div>

          {/* Enlaces relacionados */}
          <div className="flex justify-center mt-8 space-x-4">
            <Link
              href="/politica-privacidad"
              className="text-terra-600 hover:text-terra-800 transition-colors"
            >
              Ver Política de Privacidad
            </Link>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="bg-terra-800 text-terra-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-terra-300 text-sm">
            © {new Date().getFullYear()} Indigo Creaciones. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
