import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function PoliticaPrivacidad() {  
  const [activeSection, setActiveSection] = useState('recopilacion')
  
  const sections = [
    {
      id: 'recopilacion',
      title: 'Recopilación de Información',
      content: `En Indigo Creaciones, recopilamos información personal cuando:
        • Realizas una consulta o pedido a través de nuestro formulario de contacto
        • Te comunicas con nosotros por WhatsApp o redes sociales
        • Interactúas con nuestro sitio web
        
        La información que podemos recopilar incluye:
        • Nombre y apellido
        • Información de contacto (teléfono, email)
        • Dirección de entrega para envíos
        • Preferencias de productos
        • Historial de comunicaciones`
    },
    {
      id: 'uso',
      title: 'Uso de la Información',
      content: `Utilizamos la información recopilada para:
        • Procesar y gestionar tus pedidos
        • Responder a tus consultas y solicitudes
        • Mejorar nuestros productos y servicios
        • Personalizar tu experiencia en nuestro sitio
        • Enviarte actualizaciones sobre tus pedidos
        • Comunicarte ofertas especiales (solo si has dado tu consentimiento)`
    },
    {
      id: 'proteccion',
      title: 'Protección de Datos',
      content: `Nos comprometemos a proteger tu información personal mediante:
        • Almacenamiento seguro de datos
        • Acceso limitado a la información personal
        • No compartir datos con terceros sin tu consentimiento
        • Actualización regular de nuestras medidas de seguridad
        • Eliminación de datos cuando ya no son necesarios`
    },
    {
      id: 'derechos',
      title: 'Tus Derechos',
      content: `Tienes derecho a:
        • Acceder a tu información personal
        • Corregir datos inexactos
        • Solicitar la eliminación de tus datos
        • Oponerte al procesamiento de tu información
        • Retirar tu consentimiento en cualquier momento
        • Solicitar una copia de tus datos personales
        
        Para ejercer cualquiera de estos derechos, contáctanos a través de indigo.creaciones76@gmail.com`
    },
    {
      id: 'cookies',
      title: 'Cookies y Tecnologías',
      content: `Utilizamos cookies y tecnologías similares para:
        • Mejorar la navegación del sitio
        • Analizar el uso del sitio web
        • Personalizar tu experiencia
        
        Puedes gestionar las preferencias de cookies a través de la configuración de tu navegador.`
    },
    {
      id: 'actualizaciones',
      title: 'Actualizaciones de la Política',
      content: `Podemos actualizar esta política ocasionalmente para reflejar cambios en nuestras prácticas. Te notificaremos sobre cambios significativos a través de:
        • Aviso en nuestro sitio web
        • Correo electrónico (si tenemos tu contacto)
        • Notificación en nuestras redes sociales
        
        Última actualización: 16 de junio de 2025`
    }
  ]

  return (
    <div className="min-h-screen bg-terra-50">
      <Head>
        <title>Política de Privacidad - Indigo Creaciones</title>
        <meta name="description" content="Política de privacidad de Indigo Creaciones" />
      </Head>

      {/* Header simplificado */}
      <header className="bg-terra-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/icon.webp" alt="Indigo Creaciones" width={40} height={40} className="rounded-lg" style={{width: '40px', height: '40px'}} />
            <span className="text-terra-100 font-playfair text-xl">Indigo Creaciones</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair text-terra-700 mb-8 text-center">
            Política de Privacidad
          </h1>
          
          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <p className="text-terra-600 text-lg leading-relaxed">
              En Indigo Creaciones, valoramos y protegemos tu privacidad. Esta política describe cómo recopilamos, 
              usamos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios.
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
                    ? 'bg-terra-600 text-white shadow-md transform -translate-y-0.5'
                    : 'bg-white text-terra-600 hover:bg-terra-100'
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
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 absolute -translate-y-4 pointer-events-none'
                }`}
                style={{ display: activeSection === section.id ? 'block' : 'none' }}
              >
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-playfair text-terra-700 mb-4">{section.title}</h2>
                  <div className="prose prose-terra max-w-none">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-terra-600 leading-relaxed mb-4">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-playfair text-terra-700 mb-4">Contacto para Privacidad</h2>
            <p className="text-terra-600 leading-relaxed">
              Si tienes preguntas sobre nuestra política de privacidad o cómo manejamos tus datos, 
              contáctanos a través de:
            </p>
            <div className="mt-4 space-y-2">
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
