import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'
import Product, { ICloudinaryImage } from '@/lib/models/Product'
import { IncomingForm, File as FormidableFile, Fields, Files } from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import path from 'path'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const config = {
  api: {
    bodyParser: false,
  },
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
  try {
    await cloudinary.uploader.destroy(public_id)
  } catch (error) {
    console.error(`Error eliminando imagen de Cloudinary ${public_id}:`, error)
  }
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'ID de producto inválido' })
  }

  try {
    switch (req.method) {
      case 'GET':
        const product = await Product.findById(id)
        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' })
        }
        return res.status(200).json(product)

      case 'PUT':
        const { fields, files } = await parseForm(req)
        
        const updateData: any = {
          name: fields.name?.[0],
          category: fields.category?.[0],
          description: fields.description?.[0],
          price: fields.price?.[0] ? parseFloat(fields.price[0]) : undefined
        }

        // Si se suben nuevos archivos, procesarlos y eliminar los antiguos
        if (Object.keys(files).length > 0) {
          const productToUpdate = await Product.findById(id)
          if (productToUpdate && productToUpdate.images) {
            const deletePromises = productToUpdate.images.map((img: any) => {
              if (img.public_id) {
                return deleteFromCloudinary(img.public_id)
              }
              return Promise.resolve()
            })
            await Promise.all(deletePromises)
          }

          const fileArray: FormidableFile[] = []
          Object.values(files).forEach((fileOrFiles) => {
            if (Array.isArray(fileOrFiles)) {
              fileArray.push(...fileOrFiles)
            } else if (fileOrFiles) {
              fileArray.push(fileOrFiles)
            }
          })

          const imagePromises = fileArray.map(uploadToCloudinary)
          updateData.images = await Promise.all(imagePromises)
        }

        // Eliminar campos undefined
        Object.keys(updateData).forEach(
          key => updateData[key] === undefined && delete updateData[key]
        )

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        )

        if (!updatedProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' })
        }

        return res.status(200).json(updatedProduct)

      case 'DELETE':
        const deletedProduct = await Product.findByIdAndDelete(id)
        
        if (!deletedProduct) {
          return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Eliminar imágenes de Cloudinary o locales
        if (deletedProduct.images && deletedProduct.images.length > 0) {
          const deletePromises = deletedProduct.images.map(async (image: any) => {
            // Si la imagen tiene public_id, es de Cloudinary
            if (image && image.public_id) {
              return deleteFromCloudinary(image.public_id)
            }
            // Si es un string, es una imagen local antigua
            if (typeof image === 'string') {
              const fullPath = path.join(process.cwd(), 'public', image)
              try {
                await fs.unlink(fullPath)
              } catch (error) {
                console.error(`Error eliminando imagen local ${fullPath}:`, error)
              }
            }
          })
          await Promise.all(deletePromises)
        }

        return res.status(200).json({ message: 'Producto eliminado correctamente' })

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error: any) {
    console.error('Error en API:', error)
    return res.status(500).json({ error: error.message })
  }
}
