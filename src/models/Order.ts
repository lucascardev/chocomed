import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IShippingDetails {
  name: string;
  phone: string;
  address: string;
  complement?: string;
  city: string;
  state: string;
}

export interface IOrder extends Document {
  userId: string; // Clerk user ID or 'guest'
  items: IOrderItem[];
  totalAmount: number;
  shippingDetails: IShippingDetails;
  status: 'pending' | 'contacted' | 'completed';
  whatsAppLink?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const ShippingDetailsSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  complement: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingDetails: { type: ShippingDetailsSchema, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'completed'], default: 'pending' },
  whatsAppLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
