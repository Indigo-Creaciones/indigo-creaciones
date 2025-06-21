import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import ImageGallery from 'react-image-gallery'
import { Popover } from '@headlessui/react'
import { CartIcon } from '@/components/icons/CartIcon'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

// Tipos
interface CloudinaryImage {
  url: string
  public_id: string
}

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  images: CloudinaryImage[]
  featured?: boolean
  onSale?: boolean
  salePrice?: number
}

// Categorías
const categories = [
  'Todas',
  'Piezas de Yeso',
  'Velas',
  'Piezas personalizadas',
  'Otros'
]

// Componente de Skeleton Loading mejorado
const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-terra-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-terra-100 rounded w-3/4" />
      <div className="h-4 bg-terra-100 rounded w-1/2" />
      <div className="h-4 bg-terra-100 rounded w-1/4" />
    </div>
  </div>
)

// Utilidad para normalizar texto (sin tildes y minúsculas)
function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export default function Products() {
  const { addItem } = useCart()
  const router = useRouter()

  // Estados
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name'>('name')
  const [products, setProducts] = useState<Product[]>([])
  const productsPerPage = 12

  // Cargar productos desde la API solo si hay cambios
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      const newProducts = data.products.map((p: any) => {
        const images = (p.images || [])
          .map((img: any) => {
            if (typeof img === 'string') {
              return { url: img, public_id: '' }
            }
            if (img && typeof img === 'object' && img.url) {
              return img
            }
            return null
          })
          .filter((i: CloudinaryImage | null): i is CloudinaryImage => i !== null)

  return { 
    ...p, 
    id: p._id, 
    images,
    featured: p.featured || false,
    onSale: p.onSale || false,
    salePrice: p.salePrice
  }
      })
      // Solo actualiza si hay cambios
      if (JSON.stringify(newProducts) !== JSON.stringify(products)) {
        setProducts(newProducts)
      }
    } catch (err) {
      setProducts([])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    fetchProducts()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchProducts, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [products])

  // Leer parámetros de la URL al cargar
  useEffect(() => {
    if (router.isReady) {
      const { categoria, filtro } = router.query
      if (categoria && typeof categoria === 'string' && categories.includes(categoria)) {
        setSelectedCategory(categoria)
      }
      // Si quieres lógica especial para filtro avanzado, agrégala aquí
      // if (filtro === 'avanzado') { ... }
    }
  }, [router.isReady, router.query])

  // Efecto para sincronizar el estado con los parámetros de la URL
  useEffect(() => {
    const { category, search, minPrice, maxPrice, page } = router.query

    if (category && typeof category === 'string') {
      setSelectedCategory(category)
    }

    if (search && typeof search === 'string') {
      setSearchTerm(search)
    }

    if (minPrice && typeof minPrice === 'string') {
      setPriceRange((prev) => ({ ...prev, min: minPrice }))
    }

    if (maxPrice && typeof maxPrice === 'string') {
      setPriceRange((prev) => ({ ...prev, max: maxPrice }))
    }

    if (page && typeof page === 'string') {
      setCurrentPage(Number(page))
    }
  }, [router.query])

  // Función de ordenamiento
  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }

  // Aplicar filtros y ordenamiento
  const filteredProducts = sortProducts(
    products.filter((product) => {
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory
      const matchesSearch = normalizeText(product.name).includes(normalizeText(searchTerm))
      const matchesPrice =
        (!priceRange.min || product.price >= Number(priceRange.min)) &&
        (!priceRange.max || product.price <= Number(priceRange.max))

      return matchesCategory && matchesSearch && matchesPrice
    })
  )

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)

  // Función para abrir WhatsApp
  const openWhatsApp = (product: Product) => {
    const message = `Hola! Me interesa el producto "${product.name}" de precio $${product.price}. ¿Podrías darme más información?`;
    const url = `https://wa.me/5493777283023?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  // Funciones de acción mejoradas
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.onSale && product.salePrice ? product.salePrice : product.price,
      image: product.images[0]?.url
    })
  }

  const handleWhatsAppClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    const message = `¡Hola! Me interesa el producto "${product.name}" de precio $${
      product.onSale && product.salePrice ? product.salePrice : product.price
    }. ¿Podrías darme más información?`
    const url = `https://wa.me/5493777283023?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-terra-50">
      <Head>
        <title>Productos - Indigo Creaciones</title>
        <meta name="description" content="Descubre nuestra colección de artesanías únicas" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-playfair mb-4"
          >
            Nuestros Productos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-terra-700"
          >
            Descubre nuestra colección de artesanías únicas
          </motion.p>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda por nombre */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-terra-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                id="search"
                className="w-full p-2 border border-terra-200 rounded-md focus:ring-2 focus:ring-terra-400 focus:border-transparent"
                placeholder="Nombre del producto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <label htmlFor="category" className="block text-terra-700 mb-1">
                Categoría
              </label>
              <select
                id="category"
                className="w-full p-2 border border-terra-200 rounded-md focus:ring-2 focus:ring-terra-400 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div>
              <label htmlFor="sort" className="block text-terra-700 mb-1">
                Ordenar por
              </label>
              <select
                id="sort"
                className="w-full p-2 border border-terra-200 rounded-md focus:ring-2 focus:ring-terra-400 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price_asc' | 'price_desc' | 'name')}
              >
                <option value="name">Nombre</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
              </select>
            </div>

            {/* Vista Grid/Lista */}
            <div className="flex items-end">
              <div className="w-full flex justify-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-terra-500 text-white' : 'bg-terra-100'}`}
                  title="Vista en cuadrícula"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-terra-500 text-white' : 'bg-terra-100'}`}
                  title="Vista en lista"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de productos */}
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}
        >
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
          ) : currentProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-terra-600 text-lg">No se encontraron productos que coincidan con los filtros.</p>
            </div>
          ) : (
            <AnimatePresence>
              {currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8, scale: 1.03, boxShadow: '0 8px 32px 0 rgba(44, 62, 80, 0.12)' }}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border border-terra-100 group flex flex-col h-full'
                      : 'bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border border-terra-100 group flex'
                  }
                  onClick={() => setSelectedProduct(product)}
                >
                  <div
                    className={`${
                      viewMode === 'grid'
                        ? 'relative w-full aspect-square bg-terra-50 flex items-center justify-center'
                        : 'relative h-40 w-40 flex-shrink-0 bg-terra-50 flex items-center justify-center'
                    } group`}
                  >
                    {product.images && product.images.length > 0 && product.images[0].url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-500 group-hover:scale-105 rounded-xl"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-terra-100 flex items-center justify-center">
                        <span className="text-terra-400">Sin imagen</span>
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-terra-800 px-2 py-1 rounded-full text-xs font-semibold shadow">
                        Destacado
                      </div>
                    )}
                    {product.onSale && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                        Oferta
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-4 flex flex-col flex-1 justify-between ${
                      viewMode === 'list' ? 'flex-1 flex-row items-center' : ''
                    }`}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-terra-700 mb-1 truncate">{product.name}</h3>
                      <p className="text-terra-600 mb-1 text-sm">{product.category}</p>
                      <div className="flex items-baseline space-x-2 mb-2">
                        {product.onSale && product.salePrice ? (
                          <>
                            <span className="text-red-500 font-bold text-lg">${product.salePrice}</span>
                            <span className="text-terra-400 line-through text-sm">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-terra-800 font-bold text-lg">${product.price}</span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`mt-3 flex ${
                        viewMode === 'list' ? 'flex-col space-y-2' : 'justify-between space-x-2'
                      }`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 group relative bg-terra-500 text-white px-4 py-2 rounded-lg hover:bg-terra-600 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden min-w-[110px]"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          <CartIcon className="w-5 h-5" />
                          <span className="font-medium">Agregar</span>
                        </span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 group relative bg-terra-500 text-white px-4 py-2 rounded-lg hover:bg-terra-600 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden min-w-[110px]"
                        onClick={(e) => handleWhatsAppClick(e, product)}
                      >
                        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                        <span className="relative flex items-center justify-center gap-2">
                          <WhatsAppIcon className="w-5 h-5" />
                          <span className="font-medium">WhatsApp</span>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Paginación */}
        {!isLoading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center space-x-2"
          >
            <button
              className="px-4 py-2 rounded bg-terra-100 text-terra-700 hover:bg-terra-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded ${
                  currentPage === page ? 'bg-terra-500 text-white' : 'bg-white text-terra-700 hover:bg-terra-100'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded bg-terra-100 text-terra-700 hover:bg-terra-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </motion.div>
        )}

        {/* Modal de producto mejorado */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Contenedor principal del Modal */}
<div className="bg-white w-full rounded-2xl max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl border border-terra-100 flex flex-col relative">

              {/* Encabezado */}
              <div className="sticky top-0 bg-white px-4 py-1.5 md:p-1 border-b border-terra-100 flex items-center justify-between">
                {/* Etiquetas de Oferta/Destacado */}
                <div className="absolute top-5 left-2 z-10 flex flex-row items-center gap-2">
                  {selectedProduct.featured && (
                    <span className="product-tag bg-yellow-400 text-terra-800 text-xs px-1 py-0.5 rounded-full font-semibold shadow sm:px-2 sm:py-1 whitespace-nowrap flex-shrink-0">
                      Destacado
                    </span>
                  )}
                  {selectedProduct.onSale && (
                    <span className="product-tag bg-red-500 text-white text-xs px-1 py-0.5 rounded-full font-semibold shadow sm:px-2 sm:py-1 whitespace-nowrap flex-shrink-0">Oferta</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-8 text-center">
                  <h2 className="text-xl md:text-3xl font-playfair text-terra-700 truncate">
                    {selectedProduct.name}
                  </h2>
                </div>
                <button
                  className="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-terra-100 text-terra-600 hover:bg-terra-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-terra-300 transition-all duration-200"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Cerrar modal"
                >
                  <span className="text-2xl" style={{ lineHeight: 0 }}>
                    ×
                  </span>
                </button>
              </div>

              {/* Contenido scrollable */}
<div className="flex-1 flex flex-col md:flex-row">

                {/* Galería */}
<div className="relative w-full md:w-1/2 h-auto max-h-[60vh] md:max-h-full bg-terra-50 flex items-center justify-center p-2">


                  <ImageGallery
                    items={selectedProduct.images.map((image) => ({
                      original: image.url,
                      thumbnail: image.url
                    }))}
                    showPlayButton={false}
                    showFullscreenButton={true}
                    showNav={true}
                    showThumbnails={false}
                    thumbnailPosition="bottom"
                    showBullets={false}
                    additionalClass="product-gallery"
                    renderLeftNav={(onClick, disabled) => (
                      <button
                        type="button"
                        className="absolute top-1/2 left-0 md:left-2 -translate-y-1/2 z-10 bg-white/80 hover:bg-terra-500 hover:text-white text-terra-700 shadow-lg rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terra-400"
                        onClick={onClick}
                        disabled={disabled}
                        aria-label="Imagen anterior"
                      >
                        <FaChevronLeft size={22} />
                      </button>
                    )}
                    renderRightNav={(onClick, disabled) => (
                      <button
                        type="button"
                        className="absolute top-1/2 right-0 md:right-2 -translate-y-1/2 z-10 bg-white/80 hover:bg-terra-500 hover:text-white text-terra-700 shadow-lg rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terra-400"
                        onClick={onClick}
                        disabled={disabled}
                        aria-label="Imagen siguiente"
                      >
                        <FaChevronRight size={22} />
                      </button>
                    )}
                  />
                </div>

                {/* Información del producto */}
<div className="p-4 md:p-6 md:w-1/2 flex flex-col flex-1">

                  <p className="text-terra-600 text-base md:text-lg font-medium mb-2">{selectedProduct.category}</p>
                  <p className="text-terra-700 text-sm md:text-lg mb-4">{selectedProduct.description}</p>
                </div>
              </div>

              {/* Barra inferior de acciones (sticky) */}
              <div className="sticky bottom-0 bg-white border-t border-terra-100 p-3">
                {/* Precio */}
                <div className="text-center mb-1 bg-terra-50 py-2 rounded-lg">
                  {selectedProduct.onSale && selectedProduct.salePrice ? (
                    <>
                      <span className="text-2xl md:text-3xl font-bold text-red-500">${selectedProduct.salePrice}</span>
                      <span className="text-base md:text-xl text-terra-400 line-through ml-2">${selectedProduct.price}</span>
                    </>
                  ) : (
                    <span className="text-2xl md:text-3xl font-bold text-terra-800">${selectedProduct.price}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="bg-terra-500 text-white px-3 py-2 rounded-xl hover:bg-terra-600 transition-all duration-300 shadow-md active:shadow-inner text-sm md:text-base font-medium flex items-center justify-center gap-2"
                  onClick={(e) => {
                    handleAddToCart(e, selectedProduct)
                    setSelectedProduct(null)
                  }}
                >
                  <CartIcon className="w-5 h-5" />
                  Agregar al Carrito
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="bg-terra-500 text-white px-3 py-2 rounded-xl hover:bg-terra-600 transition-all duration-300 shadow-md active:shadow-inner text-sm md:text-base font-medium flex items-center justify-center gap-2"
                    onClick={(e) => handleWhatsAppClick(e, selectedProduct)}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Consultar por WhatsApp
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
