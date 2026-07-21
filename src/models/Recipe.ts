import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipeNutritionalInfo {
  calories: number;
  carbs: number;
  glycemicIndex: number;
}

export interface IRecipe extends Document {
  title: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: IRecipeNutritionalInfo;
  image: string;
  createdAt: Date;
}

const RecipeSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  nutritionalInfo: {
    calories: { type: Number, required: true },
    carbs: { type: Number, required: true },
    glycemicIndex: { type: Number, required: true },
  },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema);
