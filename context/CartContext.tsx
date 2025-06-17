import { createContext, useContext, useReducer, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: CartState }

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      }
    }

    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return state

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity)
      }
    }

    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state

      const quantityDiff = action.payload.quantity - item.quantity

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      }
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }

    case 'HYDRATE':
      return action.payload

    default:
      return state
  }
}

// Reemplazo el useReducer y el reducer para soportar HYDRATE correctamente
const cartReducerWithHydrate = (state: CartState, action: CartAction | { type: 'HYDRATE', payload: CartState }): CartState => {
  if (action.type === 'HYDRATE') {
    return action.payload
  }
  return cartReducer(state, action as CartAction)
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [state, dispatch] = useReducer(cartReducerWithHydrate, { items: [], total: 0 })

  // Hidratar carrito desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed && parsed.items && parsed.total !== undefined) {
            dispatch({ type: 'HYDRATE', payload: parsed })
          }
        } catch {}
      }
      setIsHydrated(true)
    }
  }, [])

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem('cart', JSON.stringify(state))
    }
  }, [state, isHydrated])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } })
    toast.success(`${item.name} agregado al carrito`)
  }

  const removeItem = (id: string) => {
    const item = state.items.find(item => item.id === id)
    if (item) {
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      toast.success(`${item.name} eliminado del carrito`)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = state.items.find(item => item.id === id)
    if (item) {
      if (quantity === 0) {
        removeItem(id)
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
        toast.success(`Cantidad actualizada: ${item.name}`)
      }
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Carrito vaciado')
  }

  // Renderizar solo cuando está hidratado
  if (!isHydrated) return null

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
