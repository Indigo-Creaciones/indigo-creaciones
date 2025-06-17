import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File as FormidableFile, Fields, Files } from 'formidable'
import mongoose from 'mongoose'
import Product, { IProduct, ICloudinaryImage } from '@/lib/models/Product'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Desactivar el bodyParser por defecto para manejar form-data
export const config = {
  api: {
    bodyParser: false,
  },
}

// Conexión a MongoDB
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Por favor, define la variable de entorno MONGODB_URI')
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI)
  }
}

// Subir imagen a Cloudinary
const uploadToCloudinary = async (file: FormidableFile): Promise<ICloudinaryImage> => {
  const result = await cloudinary.uploader.upload(file.filepath, {
    folder: 'indigo_creaciones',
    format: 'webp',
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  })
  return {
    url: result.secure_url,
    public_id: result.public_id,
  }
}

// Eliminar imagen de Cloudinary
const deleteFromCloudinary = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id)
}

// Manejar la subida de archivos
const parseForm = async (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
    })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  try {
    switch (req.method) {
      case 'GET':
        const { category, search, page = '1', limit = '12' } = req.query
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
        let query: any = {}
        if (category && category !== 'Todas') {
          query.category = category
        }
        if (search) {
          query.name = { $regex: search, $options: 'i' }
        }
        const products = await Product.find(query)
          .skip(skip)
          .limit(parseInt(limit as string))
          .sort({ _id: -1 })
        const total = await Product.countDocuments(query)
        return res.status(200).json({
          products,
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        })

      case 'POST':
        // TODO: Implementar verificación de admin
        const { fields, files } = await parseForm(req)
        const fileArray: FormidableFile[] = []
        Object.values(files).forEach((fileOrFiles) => {
          if (Array.isArray(fileOrFiles)) {
            fileArray.push(...fileOrFiles)
          } else if (fileOrFiles) {
            fileArray.push(fileOrFiles)
          }
        })

        const imagePromises = fileArray.map((file) => uploadToCloudinary(file))
        const uploadedImages = await Promise.all(imagePromises)

        const product = await Product.create({
          name: fields.name?.[0] || '',
          category: fields.category?.[0] || '',
          description: fields.description?.[0] || '',
          price: parseFloat(fields.price?.[0] || '0'),
          images: uploadedImages,
        })
        return res.status(201).json(product)

      case 'DELETE':
        // TODO: Implementar verificación de admin
        const { id } = req.query
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'ID de producto inválido' })
        }

        const productToDelete = await Product.findById(id)
        if (!productToDelete) {
          return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Eliminar imágenes de Cloudinary
        const deletePromises = productToDelete.images.map((img) =>
          deleteFromCloudinary(img.public_id)
        )
        await Promise.all(deletePromises)

        // Eliminar producto de la base de datos
        await Product.findByIdAndDelete(id)

        return res.status(200).json({ message: 'Producto eliminado correctamente' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    console.error('Error en API:', error)
    return res.status(500).json({ error: error.message })
  }
}
