import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Transition } from '@headlessui/react'

interface ShippingModalProps {
  onClose: () => void
  onConfirm: (withShipping: boolean, zipCode?: string) => void
}

const ShippingModal = ({ onClose, onConfirm }: ShippingModalProps) => {
  const [withShipping, setWithShipping] = useState<boolean | null>(null)
  const [zipCode, setZipCode] = useState('')
  const [zipCodeError, setZipCodeError] = useState<string | null>(null)


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-terra-100 relative"
      >
        <button
          className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-terra-100 text-terra-400 hover:bg-terra-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-terra-300 shadow transition-all duration-200 text-2xl active:scale-90 focus:scale-105"
          onClick={onClose}
          aria-label="Cerrar"
          style={{fontWeight: 700, fontFamily: 'Playfair Display, serif'}}
        >
          ×
        </button>
        <h3 className="text-2xl font-bold text-terra-700 mb-4 text-center">¿El pedido será con envío?</h3>
        <div className="space-y-4 mb-6">
          <button
            className={`w-full p-3 rounded-xl border font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-terra-400 ${
              withShipping === true
                ? 'bg-terra-500 text-white border-terra-500 shadow-lg scale-105'
                : 'border-terra-300 hover:border-terra-500 bg-terra-50 text-terra-700'
            }`}
            onClick={() => setWithShipping(true)}
          >
            Sí, con envío
          </button>
          <button
            className={`w-full p-3 rounded-xl border font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-terra-400 ${
              withShipping === false
                ? 'bg-terra-500 text-white border-terra-500 shadow-lg scale-105'
                : 'border-terra-300 hover:border-terra-500 bg-terra-50 text-terra-700'
            }`}
            onClick={() => setWithShipping(false)}
          >
            No, retiro en local
          </button>
        </div>
        {withShipping === true && (
          <div className="mb-6">
            <label htmlFor="zipCode" className="block text-terra-700 mb-1 font-medium">
              Código Postal
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value
                setZipCode(value)
                if (value === "3432") {
                  setZipCodeError("No se realizan envios dentro de la ciudad. Disculpe las molestias.")
                } else {
                  setZipCodeError(null)
                }
              }}
              className="w-full p-3 border border-terra-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terra-400 text-lg"
              required
              placeholder="Ej: 3400"
              maxLength={8}
            />
            {zipCodeError && (
              <p className="mt-2 text-red-500 text-sm font-medium">{zipCodeError}</p>
            )}
          </div>
        )}
        <div className="flex space-x-4 mt-2">
          <button
            className="flex-1 py-3 rounded-lg border-2 border-terra-400 text-terra-500 bg-white hover:bg-terra-100 hover:text-terra-700 font-semibold text-lg transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-terra-400"
            onClick={onClose}
            style={{fontFamily: 'Playfair Display, serif', letterSpacing: '0.01em'}}
          >
            Cancelar
          </button>
          <button
            className="flex-1 py-3 rounded-lg bg-terra-500 text-white hover:bg-terra-600 font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terra-400 disabled:opacity-50"
            onClick={() => {
              if (withShipping === null) return
              onConfirm(withShipping, withShipping ? zipCode : undefined)
            }}
            disabled={withShipping === null || (withShipping && (!zipCode || zipCode === "3432"))}
            style={{fontFamily: 'Playfair Display, serif', letterSpacing: '0.01em'}}
          >
            Confirmar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [showShippingModal, setShowShippingModal] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleWhatsAppClick = (withShipping: boolean, zipCode?: string) => {
    setShowShippingModal(false)
    
    const items = state.items
      .map(item => `- ${item.name} x${item.quantity} ($${item.price * item.quantity})`)
      .join('\n')

    const message = `¡Hola! Me gustaría hacer el siguiente pedido:\n\n${items}\n\nTotal: $${state.total}\n\n${
      withShipping
        ? `Con envío al código postal: ${zipCode}`
        : 'Retiro en local'
    }`

    const whatsappUrl = `https://wa.me/5493777283023?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <AnimatePresence>
      {showShippingModal && (
        <ShippingModal
          onClose={() => setShowShippingModal(false)}
          onConfirm={handleWhatsAppClick}
        />
      )}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.96, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 20, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl max-w-2xl w-full mx-2 max-h-[92vh] flex flex-col shadow-2xl border border-terra-100 relative"
        >
          <div className="p-5 border-b border-terra-100 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
            <h2 className="text-2xl md:text-3xl font-playfair text-terra-700">Carrito de Compras</h2>
            <button
              onClick={onClose}
              className="text-terra-400 transition-colors duration-300 text-2xl font-bold rounded-full focus:outline-none focus:ring-4 focus:ring-terra-300 active:scale-95 shadow-md w-10 h-10 flex items-center justify-center bg-terra-100 hover:bg-terra-500 hover:text-white focus:bg-terra-500 focus:text-white"
              aria-label="Cerrar carrito"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-terra-50 rounded-b-2xl scrollbar-thin scrollbar-thumb-terra-200 scrollbar-track-terra-50">
            <AnimatePresence>
              {state.items.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-terra-600 text-lg py-12"
                >
                  El carrito está vacío
                </motion.p>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                      className="flex items-center space-x-3 md:space-x-4 bg-white p-3 md:p-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-terra-100"
                    >
                      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-lg border border-terra-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-terra-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-terra-300" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-terra-700 truncate text-base md:text-lg">{item.name}</h3>
                        <p className="text-terra-600 text-sm md:text-base">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                            setFeedback('-1')
                            setTimeout(() => setFeedback(null), 400)
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-terra-100 hover:bg-terra-500 hover:text-white text-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-terra-300 shadow-md active:scale-90"
                          aria-label="Disminuir cantidad"
                        >
                          –
                        </motion.button>
                        <span className={`w-8 text-center font-semibold text-lg ${feedback === '-1' ? 'text-red-500 scale-110 transition-all' : feedback === '+1' ? 'text-green-600 scale-110 transition-all' : ''}`}>{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            updateQuantity(item.id, item.quantity + 1)
                            setFeedback('+1')
                            setTimeout(() => setFeedback(null), 400)
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-terra-100 hover:bg-terra-500 hover:text-white text-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-terra-300 shadow-md active:scale-90"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="bg-red-400 hover:bg-red-500 transition-all duration-200 text-xl ml-2 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full w-9 h-9 flex items-center justify-center shadow-md active:scale-90"
                        aria-label="Eliminar producto"
                      >
                        <span className="material-icons text-white">delete_outline</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
          {state.items.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 md:p-6 border-t border-terra-100 bg-white rounded-b-2xl sticky bottom-0 z-10"
            >
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <span className="text-xl font-semibold text-terra-700">Total:</span>
                <motion.span 
                  key={state.total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-terra-800"
                >
                  ${state.total.toLocaleString()}
                </motion.span>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShippingModal(true)}
                  className="w-full bg-terra-500 text-white py-3 rounded-lg hover:bg-terra-600 transition-colors duration-300 shadow-md hover:shadow-lg font-semibold text-lg"
                >
                  Consultar por WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    clearCart()
                    setFeedback('clear')
                    setTimeout(() => setFeedback(null), 600)
                  }}
                  className="w-full border-2 border-red-400 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-red-300 shadow-md active:scale-95"
                >
                  Vaciar Carrito
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
