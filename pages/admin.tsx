import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  images: string[]
  featured?: boolean
  onSale?: boolean
  salePrice?: number
}

const categories = [
  'Piezas de Yeso',
  'Velas',
  'Piezas personalizadas',
  'Otros'
]

export default function Admin() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState({
    name: '',
    category: categories[0],
    description: '',
    price: '',
    images: [] as File[],
    featured: false,
    onSale: false,
    salePrice: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products.map((p: any) => ({ ...p, id: p._id })))
    } catch (err) {
      toast.error('Error al cargar productos')
    }
    setLoading(false)
  }

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/login')
    } else {
      fetchProducts()
    }
  }, [router])

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setForm(prev => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[]
      setForm(prev => ({ ...prev, images: fileArray }))
    }
  }

  // Add or edit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('category', form.category)
      formData.append('description', form.description)
      formData.append('price', form.price)
      // Convert booleans to strings for server
      formData.append('featured', form.featured ? 'true' : 'false')
      formData.append('onSale', form.onSale ? 'true' : 'false')
      if (form.salePrice !== '') {
        formData.append('salePrice', form.salePrice)
      }

      form.images.forEach((img) => formData.append('images', img))

      let res, data
      if (isEditing && editProductId) {
        res = await fetch(`/api/products/${editProductId}`, {
          method: 'PUT',
          body: formData
        })
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          body: formData
        })
      }
      data = await res.json()
      if (res.ok) {
        toast.success(isEditing ? 'Producto modificado con éxito' : 'Producto agregado con éxito')
      } else {
        throw new Error(data.error || 'Error al guardar producto')
      }

      // Reset form
      setForm({ 
        name: '', 
        category: categories[0], 
        description: '', 
        price: '', 
        images: [], 
        featured: false, 
        onSale: false, 
        salePrice: '' 
      })
      setIsEditing(false)
      setEditProductId(null)

      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchProducts()
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el producto')
    }
    setLoading(false)
  }

  // Editar producto
  const handleEdit = (product: Product) => {
    setIsEditing(true)
    setEditProductId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      images: [],
      featured: product.featured || false,
      onSale: product.onSale || false,
      salePrice: product.salePrice ? product.salePrice.toString() : ''
    })

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Eliminar producto (modal)
  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Producto eliminado correctamente')
        setShowDeleteModal(false)
        setProductToDelete(null)
        fetchProducts()
      } else {
        throw new Error(data.error || 'Error al eliminar producto')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar producto')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-terra-50 via-terra-100 to-terra-200 flex flex-col">
      <Head>
        <title>Panel Administrativo - Indigo Creaciones</title>
        <meta name="description" content="Panel administrativo para gestionar productos" />
      </Head>

      {/* Header */}
      <header className="bg-terra-100 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/icon.webp" alt="Indigo Creaciones" width={40} height={40} />
            <span className="text-terra-700 font-playfair text-xl cursor-pointer">Indigo Creaciones</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-playfair text-terra-700 mb-8 text-center"
        >
          Panel Administrativo
        </motion.h1>

        {/* Formulario para agregar/editar producto */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-2xl mb-10 max-w-3xl mx-auto border border-terra-100"
        >
          <h2 className="text-2xl font-semibold mb-4 text-terra-700 flex items-center gap-2">
            {isEditing ? (
              <>
                <svg className="w-6 h-6 text-terra-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg>
                Editar Producto
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-terra-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Agregar Nuevo Producto
              </>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-terra-700 mb-1 font-medium">Nombre del producto</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full p-3 border border-terra-200 rounded-lg focus:ring-2 focus:ring-terra-400 focus:border-transparent bg-terra-50 text-terra-800 placeholder-terra-400 shadow-sm"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-terra-700 mb-1 font-medium">Categoría</label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-3 border border-terra-200 rounded-lg focus:ring-2 focus:ring-terra-400 focus:border-transparent bg-terra-50 text-terra-800 shadow-sm"
                  value={form.category}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-terra-700 mb-1 font-medium">Descripción</label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="w-full p-3 border border-terra-200 rounded-lg focus:ring-2 focus:ring-terra-400 focus:border-transparent bg-terra-50 text-terra-800 placeholder-terra-400 shadow-sm"
                value={form.description}
                onChange={handleInputChange}
                maxLength={500}
                placeholder="Descripción del producto"
                disabled={loading}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-terra-700 mb-1 font-medium">Precio</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  className="w-full p-3 border border-terra-200 rounded-lg focus:ring-2 focus:ring-terra-400 focus:border-transparent bg-terra-50 text-terra-800 placeholder-terra-400 shadow-sm"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="$0.00"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="images" className="block text-terra-700 mb-1 font-medium">Imágenes</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border border-terra-200 rounded-lg bg-terra-50 text-terra-800 shadow-sm"
                  ref={fileInputRef}
                  disabled={loading}
                />
                <p className="text-xs text-terra-500 mt-1">Las imágenes se convertirán automáticamente a .webp</p>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label htmlFor="featured" className="block text-terra-700 mb-1 font-medium">Destacado</label>
    <input
      type="checkbox"
      id="featured"
      name="featured"
      checked={form.featured}
      onChange={handleCheckboxChange}
      className="mr-2"
      disabled={loading}
    />
  </div>
  <div>
    <label htmlFor="onSale" className="block text-terra-700 mb-1 font-medium">En Oferta</label>
    <input
      type="checkbox"
      id="onSale"
      name="onSale"
      checked={form.onSale}
      onChange={handleCheckboxChange}
      className="mr-2"
      disabled={loading}
    />
  </div>
</div>
{form.onSale && (
  <div>
    <label htmlFor="salePrice" className="block text-terra-700 mb-1 font-medium">Precio de Oferta</label>
    <input
      type="number"
      id="salePrice"
      name="salePrice"
      required
      className="w-full p-3 border border-terra-200 rounded-lg focus:ring-2 focus:ring-terra-400 focus:border-transparent bg-terra-50 text-terra-800 placeholder-terra-400 shadow-sm"
      value={form.salePrice}
      onChange={handleInputChange}
      placeholder="$0.00"
      disabled={loading}
    />
  </div>
)}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-terra-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-terra-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : null}
              {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
            </motion.button>
          </form>
        </motion.section>

        {/* Listado de productos */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg p-8 md:p-10 rounded-2xl shadow-2xl max-w-6xl mx-auto border border-terra-100 overflow-x-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-terra-700 flex items-center gap-2">
            <svg className="w-6 h-6 text-terra-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
            Productos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-terra-200 text-terra-800">
              <thead>
                <tr className="bg-terra-100">
                  <th className="border border-terra-200 px-4 py-2 text-left font-semibold">Nombre</th>
                  <th className="border border-terra-200 px-4 py-2 text-left font-semibold">Categoría</th>
                  <th className="border border-terra-200 px-4 py-2 text-left font-semibold">Precio</th>
                  <th className="border border-terra-200 px-4 py-2 text-center font-semibold">Destacado</th>
                  <th className="border border-terra-200 px-4 py-2 text-center font-semibold">Oferta</th>
                  <th className="border border-terra-200 px-4 py-2 text-center font-semibold">Editar</th>
                  <th className="border border-terra-200 px-4 py-2 text-center font-semibold">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center p-4 text-terra-500">Cargando...</td></tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-terra-500">
                      No hay productos disponibles.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01, backgroundColor: '#f3f4f6' }}
                      className="hover:bg-terra-50 transition-all"
                    >
                      <td className="border border-terra-200 px-4 py-2">{product.name}</td>
                      <td className="border border-terra-200 px-4 py-2">{product.category}</td>
                      <td className="border border-terra-200 px-4 py-2">
                        {product.onSale && product.salePrice ? (
                          <span>
                            <span className="text-red-500 font-bold">${product.salePrice}</span>
                            <span className="text-terra-400 line-through ml-2">${product.price}</span>
                          </span>
                        ) : (
                          <span>${product.price}</span>
                        )}
                      </td>
                      <td className="border border-terra-200 px-4 py-2 text-center">
                        {product.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="border border-terra-200 px-4 py-2 text-center">
                        {product.onSale ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sí
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No
                          </span>
                        )}
                      </td>
                      <td className="border border-terra-200 px-4 py-2 text-center">
                        <button
                          className="group bg-terra-100 hover:bg-terra-200 text-terra-600 hover:text-terra-800 p-2 rounded-full shadow transition-all focus:outline-none focus:ring-2 focus:ring-terra-400 flex items-center justify-center mx-auto"
                          onClick={() => handleEdit(product)}
                          title="Editar"
                          disabled={loading}
                          aria-label="Editar producto"
                        >
                          <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="m12.879,4.879l-6.879,6.878v4.243h4.242l6.879-6.878c.566-.567.879-1.32.879-2.122s-.313-1.555-.879-2.121c-1.17-1.17-3.072-1.17-4.242,0Zm2.828,2.828l-6.293,6.293h-1.414v-1.415l6.293-6.292c.391-.39,1.023-.39,1.414,0,.189.188.293.439.293.707s-.104.518-.293.707ZM21,0H3C1.346,0,0,1.346,0,3v17h6.923l3.749,3.157c.382.339.861.507,1.337.507.468,0,.931-.163,1.292-.484l3.848-3.18h6.852V3c0-1.654-1.346-3-3-3Zm1,18h-5.571l-4.448,3.645-4.327-3.645H2V3c0-.551.448-1,1-1h18c.552,0,1,.449,1,1v15Z"/>
                          </svg>
                        </button>
                      </td>
                      <td className="border border-terra-200 px-4 py-2 text-center">
                        <button
                          className="group bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 p-2 rounded-full shadow transition-all focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center mx-auto"
                          onClick={() => handleDelete(product)}
                          title="Eliminar"
                          disabled={loading}
                          aria-label="Eliminar producto"
                        >
                          <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="m15.561 13.561-1.44 1.439 1.44 1.439a1.5 1.5 0 0 1 -2.122 2.122l-1.439-1.44-1.439 1.44a1.5 1.5 0 0 1 -2.122-2.122l1.44-1.439-1.44-1.439a1.5 1.5 0 0 1 2.122-2.122l1.439 1.44 1.439-1.44a1.5 1.5 0 0 1 2.122 2.122zm6.439-5.404v10.343a5.506 5.506 0 0 1 -5.5 5.5h-9a5.506 5.506 0 0 1 -5.5-5.5v-13a5.506 5.506 0 0 1 5.5-5.5h6.343a5.464 5.464 0 0 1 3.889 1.611l2.657 2.657a5.464 5.464 0 0 1 1.611 3.889zm-3 10.343v-9.5h-4a2 2 0 0 1 -2-2v-4h-5.5a2.5 2.5 0 0 0 -2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5z"/>
                          </svg>
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-terra-100 text-center flex flex-col items-center"
            >
              <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              <h3 className="text-xl font-semibold text-terra-700 mb-2">¿Eliminar producto?</h3>
              <p className="text-terra-600 mb-6">Esta acción eliminará <span className="font-bold">{productToDelete.name}</span> y todas sus imágenes. ¿Deseas continuar?</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="flex-1 py-2 rounded-lg bg-terra-100 text-terra-700 hover:bg-terra-200 font-semibold transition-colors border border-terra-200"
                  onClick={() => { setShowDeleteModal(false); setProductToDelete(null); }}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold transition-colors border border-red-500"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  ) : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
