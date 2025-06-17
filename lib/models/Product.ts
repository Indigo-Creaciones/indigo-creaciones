import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICloudinaryImage {
  url: string;
  public_id: string;
}

export interface IProduct extends Document {
  name: string
  category: string
  description: string
  price: number
  images: ICloudinaryImage[]
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
})

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
