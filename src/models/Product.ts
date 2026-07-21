import mongoose, { Schema, Document } from 'mongoose';

export interface INutritionalInfo {
  calories: number;
  carbs: number;
  glycemicIndex: number;
  glycemicLoad: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  ingredients: string;
  nutritionalInfo: INutritionalInfo;
  image: string;
  stock: number;
  category: string;
  rating: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: { type: String, required: true },
  nutritionalInfo: {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true }, // in grams per porção
    glycemicIndex: { type: Number, required: true },
    glycemicLoad: { type: Number, required: true },
  },
  image: { type: String, required: true },
  stock: { type: Number, default: 100 },
  category: { type: String, required: true },
  rating: { type: Number, default: 5 },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
