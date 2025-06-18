import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCart } from '@/context/CartContext'
import CartModal from './CartModal'
import { CartIcon } from './icons/CartIcon'

// Función para hacer scroll a una sección por id
function scrollToSection(id: string) {
  const headerOffset = 100;
  const section = document.getElementById(id);
  if (section) {
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerClass, setHeaderClass] = useState('bg-terra-800')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()
  const router = useRouter();

  // Estado para el botón activo
  const [activeBtn, setActiveBtn] = useState('inicio');

  // Detectar sección activa en home
  useEffect(() => {
    if (router.pathname !== '/') {
      // Si no es home, marcar según ruta
      if (router.pathname === '/productos') setActiveBtn('productos');
      else if (router.pathname === '/admin') setActiveBtn('admin');
      else setActiveBtn('inicio');
      return;
    }
    // Si es home, escuchar scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const getSectionTop = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      };
      const procesoTop = getSectionTop('proceso') - 120;
      const sobreTop = getSectionTop('sobre-nosotros') - 120;
      const contactoTop = getSectionTop('contacto') - 120;
      if (scrollY < procesoTop) setActiveBtn('inicio');
      else if (scrollY >= procesoTop && scrollY < sobreTop) setActiveBtn('proceso');
      else if (scrollY >= sobreTop && scrollY < contactoTop) setActiveBtn('sobre-nosotros');
      else if (scrollY >= contactoTop) setActiveBtn('contacto');
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router.pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = docHeight > 0 ? scrollY / docHeight : 0
      // 0 = top, 1 = bottom
      let colorClass = 'bg-terra-800'
      if (percent < 0.2) colorClass = 'bg-terra-800'
      else if (percent < 0.4) colorClass = 'bg-terra-700'
      else if (percent < 0.6) colorClass = 'bg-terra-600'
      else if (percent < 0.8) colorClass = 'bg-terra-500'
      else colorClass = 'bg-terra-400'
      setHeaderClass(colorClass)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartItemsCount = state.items.reduce((acc, item) => acc + item.quantity, 0)

  // Handler para navegación scroll
  const handleNav = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (router.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      router.push('/').then(() => {
        setTimeout(() => scrollToSection(sectionId), 400);
      });
    }
    setIsMenuOpen(false);
  };
  // Handler para ir a inicio desde cualquier página
  const handleInicio = (e: React.MouseEvent) => {
    e.preventDefault();
    if (router.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`header-shadow header-border sticky top-0 z-50 transition-colors duration-300 ${headerClass}`}> 
        <div className="w-full flex items-center justify-between p-4 lg:px-0 xl:px-0 2xl:px-0">
          <Link href="/" className="logo-highlight gap-3" style={{height: '72px'}}>
              <Image src="/icon.webp" alt="Indigo Creaciones Logo" width={72} height={72} style={{height: '72px', width: '72px', minWidth: '72px', minHeight: '72px', objectFit: 'contain'}} />
              <span className="font-playfair text-2xl font-bold drop-shadow logo-title">Indigo Creaciones</span>
          </Link>
          <div className="flex-1 flex justify-center min-w-0">
            <nav className="hidden md:flex items-center gap-3 xl:gap-6 min-w-0 flex-shrink">
              <a href="#" className={`nav-btn${activeBtn==='inicio' ? ' active' : ''}`} onClick={handleInicio}>Inicio</a>
              <Link href="/productos" className={`nav-btn${activeBtn==='productos' ? ' active' : ''}`}>Productos</Link>
              <a href="#" className={`nav-btn${activeBtn==='proceso' ? ' active' : ''}`} onClick={handleNav('proceso')}>Proceso</a>
              <a href="#" className={`nav-btn${activeBtn==='sobre-nosotros' ? ' active' : ''}`} onClick={handleNav('sobre-nosotros')}>Sobre Nosotros</a>
              <a href="#" className={`nav-btn${activeBtn==='contacto' ? ' active' : ''}`} onClick={handleNav('contacto')}>Contacto</a>
            </nav>
          </div>
          {/* Botones a la derecha, solo PC */}
          <div className="hidden md:flex items-center gap-2 xl:gap-4 min-w-[200px] max-w-full mr-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center group bg-transparent p-0 shadow-none mr-2"
              aria-label="Abrir carrito"
              style={{boxShadow: 'none', background: 'transparent'}}
            >
              <div className="header-cart-move !bg-transparent !shadow-none">
                <CartIcon className="w-7 h-7 text-white drop-shadow-lg" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-terra-700 via-terra-500 to-terra-300 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-md border-2 border-white group-hover:scale-125 transition-transform duration-200">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </button>
            <Link href="/admin" className="header-admin flex items-center w-full justify-center min-w-[100px]">
              <span className="material-icons" style={{fontSize:'1.2rem'}}>person</span> Admin
            </Link>
          </div>
          {/* Botones a la derecha, solo móvil */}
          <div className="flex md:hidden items-center gap-2 xl:gap-4 min-w-[20px] max-w-full mr-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center group bg-transparent p-0 shadow-none"
              aria-label="Abrir carrito"
              style={{boxShadow: 'none', background: 'transparent'}}
            >
              <div className="header-cart-move !bg-transparent !shadow-none">
                <CartIcon className="w-7 h-7 text-white drop-shadow-lg" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-terra-700 via-terra-500 to-terra-300 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-md border-2 border-white group-hover:scale-125 transition-transform duration-200">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </button>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-terra-100 p-4 space-y-2">
            <a href="#" className={`block header-btn${activeBtn==='inicio' ? ' active' : ''}`} onClick={handleInicio}>Inicio</a>
            <Link href="/productos" className={`block header-btn${activeBtn==='productos' ? ' active' : ''}`}>Productos</Link>
            <a href="#" className={`block header-btn${activeBtn==='proceso' ? ' active' : ''}`} onClick={handleNav('proceso')}>Proceso</a>
            <a href="#" className={`block header-btn${activeBtn==='sobre-nosotros' ? ' active' : ''}`} onClick={handleNav('sobre-nosotros')}>Sobre Nosotros</a>
            <a href="#" className={`block header-btn${activeBtn==='contacto' ? ' active' : ''}`} onClick={handleNav('contacto')}>Contacto</a>
            <Link href="/admin" className="block header-admin">
              <span className="material-icons" style={{fontSize:'1.2rem'}}>person</span> Admin
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="header-cart mt-2 mx-2 flex items-center"
            >
              <CartIcon className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </nav>
        )}
      </header>

      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </>
  )
}
