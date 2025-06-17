import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { useState } from 'react'
import toast from 'react-hot-toast';

// Categorías de productos
const categories = [
  { id: 1, name: 'Piezas de Yeso', description: 'Gran variedad de piezas pintadas y decoradas.' },
  { id: 2, name: 'Velas', description: 'Decorativas y aromáticas, en diferentes contenedores, colores, formas y aromas.' },
  { id: 3, name: 'Piezas personalizadas', description: 'Ajustadas al presupuesto de cada cliente. Consulta la tuya!' },
  { id: 4, name: 'Otros', description: 'Descubre más productos únicos' }
]

// Pasos del proceso
const processSteps = [
  {
    title: 'Diseño',
    description: 'Cada pieza comienza con un diseño único y cuidadosamente planificado.'
  },
  {
    title: 'Elaboración',
    description: 'Creamos cada pieza con materiales de primera calidad.'
  },
  {
    title: 'Acabado',
    description: 'Cuidamos cada detalle para lograr un acabado perfecto.'
  }
]

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Consulta general',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading('Enviando mensaje...', { id: 'contact-send' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        toast.success('¡Mensaje enviado correctamente!', {
          id: 'contact-send',
          iconTheme: { primary: '#8b582d', secondary: '#fff' },
          style: {
            background: '#fff',
            color: '#8b582d',
            border: '1.5px solid #8b582d',
            fontFamily: 'var(--font-playfair), var(--font-inter), sans-serif',
            fontWeight: 500,
            fontSize: '1.1rem',
            boxShadow: '0 4px 24px 0 #8b582d22',
          },
        });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: 'Consulta general',
          message: '',
        });
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error enviando el mensaje.', {
          id: 'contact-send',
          iconTheme: { primary: '#b91c1c', secondary: '#fff' },
          style: {
            background: '#fff',
            color: '#b91c1c',
            border: '1.5px solid #b91c1c',
            fontFamily: 'var(--font-playfair), var(--font-inter), sans-serif',
            fontWeight: 500,
            fontSize: '1.1rem',
            boxShadow: '0 4px 24px 0 #b91c1c22',
          },
        });
      }
    } catch (err) {
      toast.error('Error enviando el mensaje.', {
        id: 'contact-send',
        iconTheme: { primary: '#b91c1c', secondary: '#fff' },
        style: {
          background: '#fff',
          color: '#b91c1c',
          border: '1.5px solid #b91c1c',
          fontFamily: 'var(--font-playfair), var(--font-inter), sans-serif',
          fontWeight: 500,
          fontSize: '1.1rem',
          boxShadow: '0 4px 24px 0 #b91c1c22',
        },
      });
    }
  }

  return (
    <div className="min-h-screen bg-terra-50">
      <Head>
        <title>Indigo Creaciones - Artesanías Únicas</title>
        <meta name="description" content="Descubre nuestra colección de piezas artesanales hechas con amor y dedicación" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Hero Banner */}
      <section id="inicio" className="relative flex items-center justify-center overflow-hidden hero-banner-section p-0 md:pt-8" style={{marginTop: '-1.2rem', minHeight: '420px', height: '55vw', maxHeight: '739px', paddingBottom: '0'}}>
        <Image
          src="/hero-banner.webp"
          alt="Banner Indigo Creaciones"
          width={1500}
          height={739}
          quality={98}
          priority
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:blur-[1px]"
          style={{position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%'}}
        />
        <div className="absolute inset-0 flex items-start justify-center text-center z-10">
          <div className="w-full max-w-3xl px-2 md:px-6 animate-fadein flex flex-col items-center mt-10 md:mt-16">
            <h1 className="hero-title-strong mb-8">
              Descubre nuestra colección de piezas artesanales hechas con amor y dedicación
            </h1>
            <Link href="/productos" className="hero-btn-dark inline-block px-12 py-4 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 mt-32 md:mt-36 hover:scale-110 hover:shadow-2xl focus:scale-105 focus:shadow-2xl active:scale-95 bg-gradient-to-tr from-terra-700 via-terra-500 to-terra-300/90 text-white backdrop-blur-md" style={{boxShadow: '0 6px 32px 0 rgba(92,59,38,0.18)'}}>
                Ver Productos
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-terra-50 via-transparent to-transparent pointer-events-none z-20"></div>
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/80 text-3xl md:text-4xl cursor-pointer z-30 hover:scale-125 transition-transform duration-300" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
          <span className="material-icons">expand_more</span>
        </span>
      </section>

      {/* Categorías */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12 text-terra-700 tracking-tight">Nuestras Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link 
                href={{
                  pathname: '/productos',
                  query: { categoria: category.name, filtro: 'avanzado' }
                }} 
                key={category.id} 
                className="group block h-full"
                scroll={false}
              >
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-terra-100 via-terra-50 to-white p-8 rounded-2xl shadow-lg border border-terra-200 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-terra-500">
                  <h3 className="text-2xl font-playfair font-bold text-terra-700 mb-3 text-center group-hover:text-terra-800 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-terra-600 text-center text-base md:text-lg font-medium mb-2 group-hover:text-terra-700 transition-colors duration-200">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Proceso */}
      <section id="proceso" className="py-20 px-4 bg-[#fbe9d3]">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair text-center mb-2 text-terra-700 font-bold">Nuestro Proceso</h2>
          <div className="w-24 h-1 bg-terra-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-center text-terra-700 mb-16 text-lg md:text-xl">Conoce cómo creamos cada pieza artesanal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-3xl shadow-md flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
              >
                <div className="mb-8">
                  {index === 0 && (
                    <span className="inline-block mb-2 transition-transform duration-300 group-hover:scale-110">
                      {/* Icono Diseño: Lápiz profesional */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 24 24" fill="#8b582d">
                        <path d="M14.515,5.776l3.71,3.71L4.881,22.828c-.75,.75-1.768,1.172-2.828,1.172H0v-2.053c0-1.061,.421-2.078,1.172-2.828L14.515,5.776Z" opacity="0.9"/>
                        <path d="M23.145,.855c-1.024-1.024-2.685-1.024-3.71,0l-3.507,3.507,3.71,3.71,3.507-3.507c1.024-1.024,1.024-2.685,0-3.71Z" opacity="0.8"/>
                        <path d="M12.266,5.196l-1.5-1.5-2.253,2.253c-.195,.195-.451,.293-.707,.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.253-2.253-1.256-1.256C6.729-.342,4.513-.342,3.146,1.025L1.025,3.146c-1.367,1.367-1.367,3.583,0,4.95l4.171,4.171,7.071-7.071Z" opacity="0.75"/>
                        <path d="M11.733,18.805l4.171,4.171c1.367,1.367,3.583,1.367,4.95,0l2.121-2.121c1.367-1.367,1.367-3.583,0-4.95l-1.256-1.256-2.253,2.253c-.391,.391-1.023,.391-1.414,0-.195-.195-.293-.451-.293-.707s.098-.512,.293-.707l2.253-2.253-1.5-1.5-7.071,7.071Z" opacity="0.7"/>
                      </svg>
                    </span>
                  )}
                  {index === 1 && (
                    <span className="inline-block mb-2 transition-transform duration-300 group-hover:scale-110">
                      {/* Icono Elaboración: Mano artesanal */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 24 24" fill="#8b582d">
                        <path d="M18,15.75c0,2.16-.84,4.19-2.37,5.72-1.69,1.69-3.91,2.54-6.13,2.54s-4.44-.84-6.13-2.54L.44,18.54c-.59-.59-.59-1.54,0-2.12s1.54-.59,2.12,0l1.76,1.76,.88-.88L.44,12.54c-.59-.59-.59-1.54,0-2.12,.59-.59,1.54-.59,2.12,0l4.76,4.76,.88-.88L2.44,8.54c-.59-.59-.59-1.54,0-2.12,.59-.59,1.54-.59,2.12,0l5.76,5.76,.88-.88-3.76-3.76c-.59-.59-.59-1.54,0-2.12,.59-.59,1.54-.59,2.12,0l4.44,4.44v-1.85c0-1.1,.9-2,2-2s2,.9,2,2v7.75Z"/>
                        <path d="M22,6c-1.1,0-2,.9-2,2v8c0,2-.66,3.48-.74,3.55-.5,1.23-1.25,2.36-2.21,3.33-.41,.41-.86,.78-1.32,1.11,2.15-.05,4.27-.89,5.91-2.52,1.53-1.53,2.37-3.56,2.37-5.72v-7.75c0-1.1-.9-2-2-2Z" opacity="0.85"/>
                        <path d="M13.71,1.71l-1.41-1.41-2.29,2.29,1.41,1.41,2.29-2.29Zm-7.75,.84L3.71,.29l-1.41,1.41,2.25,2.25,1.41-1.41ZM9,0h-2V3h2V0Z" opacity="0.75"/>
                      </svg>
                    </span>
                  )}
                  {index === 2 && (
                    <span className="inline-block mb-2 transition-transform duration-300 group-hover:scale-110">
                      {/* Icono Acabado: Pincel nuevo diseño */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 24 24" fill="#8b582d">
                        <path d="m.024 23.976.076-1.05c.076-1.1.545-6.688 2.307-8.451a5.036 5.036 0 0 1 7.118 7.125c-1.762 1.762-7.349 2.23-8.452 2.306zm23.076-23.108a3.137 3.137 0 0 0 -4.333 0l-10.515 10.519a6.967 6.967 0 0 1 4.342 4.324l10.506-10.511a3.067 3.067 0 0 0 0-4.332z"/>
                      </svg>
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-terra-700 mb-3 font-playfair">{step.title}</h3>
                <p className="text-terra-600 text-base md:text-lg font-medium leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section id="sobre-nosotros" className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#fbe9d3] rounded-full -translate-x-32 -translate-y-32 opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-terra-100 rounded-full translate-x-48 translate-y-48 opacity-10"></div>
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenido de texto */}
            <div className="text-left space-y-6 lg:pr-8" data-aos="fade-right">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-playfair mb-4 text-terra-700 relative">
                  Sobre Nosotros
                  <span className="absolute -bottom-3 left-0 w-24 h-1 bg-terra-500 rounded-full"></span>
                </h2>
                <h3 className="text-xl md:text-2xl text-terra-600 mt-8 font-medium">
                  Conoce la historia detrás de nuestras creaciones
                </h3>
              </div>
              <p className="text-terra-600 text-lg leading-relaxed mb-6 transform transition-all duration-500 hover:translate-x-2">
                En Índigo Creaciones, nuestra pasión es crear piezas únicas que cuenten historias y embellezcan espacios. 
                Cada pieza es elaborada con dedicación y amor por el detalle.
              </p>
              <p className="text-terra-600 text-lg leading-relaxed transform transition-all duration-500 hover:translate-x-2">
                Nuestro compromiso es mantener vivas las técnicas artesanales tradicionales mientras incorporamos 
                diseños contemporáneos que se adaptan a los gustos actuales.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-terra-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-terra-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-terra-700 font-medium">Diseños Únicos y Personalizados</p>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-terra-50 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-terra-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-terra-700 font-medium">Calidad Artesanal Superior</p>
                </div>
              </div>
            </div>

            {/* Imagen decorativa */}
            <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] group" data-aos="fade-left">              <Image
                src="/about-us.webp"
                alt="Nuestras Creaciones Artesanales"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terra-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-2xl font-playfair mb-2">Tradición y Modernidad</p>
                <p className="text-sm opacity-90">Fusionamos técnicas tradicionales con diseños contemporáneos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 px-4 bg-terra-50 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-terra-200 rounded-full translate-x-1/2 -translate-y-1/2 opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fbe9d3] rounded-full -translate-x-1/2 translate-y-1/2 opacity-20"></div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair text-terra-700 mb-4 relative inline-block">
              Contacto
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-terra-500 rounded-full"></div>
            </h2>
            <p className="text-terra-600 text-lg md:text-xl mt-8">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Formulario de contacto */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-terra-700 mb-2 font-medium transition-colors group-focus-within:text-terra-800">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-500 transition-all"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="email" className="block text-terra-700 mb-2 font-medium transition-colors group-focus-within:text-terra-800">Email (opcional)</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-500 transition-all"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="phone" className="block text-terra-700 mb-2 font-medium transition-colors group-focus-within:text-terra-800">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-500 transition-all"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="+54 9 XXXX XX-XXXX"
                  />
                </div>
                <div className="group">
                  <label htmlFor="subject" className="block text-terra-700 mb-2 font-medium transition-colors group-focus-within:text-terra-800">Asunto</label>
                  <select
                    id="subject"
                    className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-500 transition-all"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  >
                    <option value="Consulta general">Consulta general</option>
                    <option value="Pieza personalizada">Pieza personalizada</option>
                    <option value="Información de envío">Información de envío</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="group">
                  <label htmlFor="message" className="block text-terra-700 mb-2 font-medium transition-colors group-focus-within:text-terra-800">Mensaje</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-500 transition-all resize-none"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Escribe tu mensaje aquí..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-terra-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-terra-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-terra-500 focus:ring-offset-2"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Información de contacto */}
            <div className="bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-playfair text-terra-700 mb-8">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-terra-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-terra-700 mb-1">Dirección</h4>
                    <p className="text-terra-600">Pedro Ferre 480, Bella Vista, Ctes, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-terra-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 005.516 5.516l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-terra-700 mb-1">Teléfono</h4>
                    <p className="text-terra-600">+54 9 3777 28-3023</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-terra-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-terra-700 mb-1">Email</h4>
                    <p className="text-terra-600">indigo.creaciones76@gmail.com</p>
                  </div>
                </div>

                {/* Redes Sociales */}
                <div className="pt-8 mt-8 border-t border-terra-100">
                  <h4 className="font-semibold text-terra-700 mb-6">Síguenos en redes sociales</h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/Indigocreaciones2020?locale=es_LA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-terra-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-terra-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/indigo1976.creaciones/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-terra-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-terra-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/5493777283023"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-terra-100 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-terra-200 hover:scale-110"
                    >
                      <svg className="w-6 h-6 text-terra-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-terra-800 text-terra-100 pt-12 pb-6">
        <div className="container mx-auto px-4">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Columna 1: Logo e información */}
            <div className="space-y-4">              <div className="flex flex-col items-center mb-6">
                <Image 
                  src="/logo.webp" 
                  alt="Indigo Creaciones" 
                  width={90} 
                  height={90} 
                  className="rounded-lg transform transition-all duration-300 hover:scale-110 mb-3" 
                  style={{width: '90px', height: '90px'}}
                />
                <span className="text-3xl font-playfair text-terra-100 font-bold tracking-wide">Indigo Creaciones</span>
              </div>
              <p className="text-terra-300 text-sm leading-relaxed text-center">
                Artesanías únicas hechas con amor y dedicación. Cada pieza cuenta una historia especial.
              </p>
            </div>            {/* Columna 2: Enlaces principales */}
            <div>
              <h4 className="text-terra-100 font-semibold text-lg mb-4">Enlaces Rápidos</h4>
              <nav className="space-y-2">                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="block text-terra-300 hover:text-terra-100 transition-colors text-left w-full bg-transparent border-none cursor-pointer p-0"
                >
                  Inicio
                </button>                <button 
                  onClick={() => {
                    window.location.href = '/productos'
                  }}
                  className="block text-terra-300 hover:text-terra-100 transition-colors text-left w-full bg-transparent border-none cursor-pointer p-0"
                >
                  Productos
                </button>
                <button 
                  onClick={() => {
                    const section = document.querySelector('section:nth-of-type(3)')
                    const headerOffset = 100
                    if (section) {
                      const elementPosition = section.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }                  }}
                  className="block text-terra-300 hover:text-terra-100 transition-colors text-left w-full bg-transparent border-none cursor-pointer p-0"
                >
                  Nuestro Proceso
                </button>
                <button 
                  onClick={() => {
                    const section = document.querySelector('section:nth-of-type(4)')
                    const headerOffset = 100
                    if (section) {
                      const elementPosition = section.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className="block text-terra-300 hover:text-terra-100 transition-colors text-left w-full bg-transparent border-none cursor-pointer p-0"
                >
                  Sobre Nosotros
                </button>
                <button 
                  onClick={() => {
                    const section = document.querySelector('section:nth-of-type(5)')
                    const headerOffset = 100
                    if (section) {
                      const elementPosition = section.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                    }
                  }}
                  className="block text-terra-300 hover:text-terra-100 transition-colors text-left w-full bg-transparent border-none cursor-pointer p-0"
                >
                  Contacto
                </button>
              </nav>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h4 className="text-terra-100 font-semibold text-lg mb-4">Contacto</h4>
              <div className="space-y-2">
                <p className="text-terra-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Pedro Ferre 480, Bella Vista
                </p>
                <p className="text-terra-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +54 9 3777 28-3023
                </p>
                <p className="text-terra-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  indigo.creaciones76@gmail.com
                </p>
              </div>
            </div>

            {/* Columna 4: Redes Sociales */}
            <div>
              <h4 className="text-terra-100 font-semibold text-lg mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/Indigocreaciones2020?locale=es_LA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-terra-700 p-2 rounded-lg text-terra-100 hover:bg-terra-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/indigo1976.creaciones/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-terra-700 p-2 rounded-lg text-terra-100 hover:bg-terra-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/5493777283023"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-terra-700 p-2 rounded-lg text-terra-100 hover:bg-terra-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-terra-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Copyright */}
              <p className="text-terra-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Indigo Creaciones. Todos los derechos reservados.
              </p>
              {/* Enlaces legales */}
              <nav className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/politica-privacidad" className="text-terra-300 hover:text-terra-100 transition-colors">
                  Política de Privacidad
                </Link>
                <Link href="/politica-cookies" className="text-terra-300 hover:text-terra-100 transition-colors">
                  Política de Cookies
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
