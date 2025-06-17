import '@/styles/globals.css'
import '../styles/header.css'
import '../styles/products.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import { Toaster } from 'react-hot-toast'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter, Playfair_Display } from 'next/font/google'
import { QueryClient, QueryClientProvider } from 'react-query'
import { CartProvider } from '@/context/CartContext'

// Configuración de fuentes
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Configuración de React Query
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className={`${inter.variable} ${playfair.variable} font-sans`}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <Component {...pageProps} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#F9FAFB',
                color: '#1F2937',
                border: '1px solid #E5E7EB',
              },
              success: {
                iconTheme: {
                  primary: '#047857',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </CartProvider>
    </QueryClientProvider>
  )
}
