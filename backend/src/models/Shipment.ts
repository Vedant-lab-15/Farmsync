import mongoose, { Document, Schema } from 'mongoose';

export interface IShipment extends Document {
  farmerId: mongoose.Types.ObjectId;
  from: string;
  to: string;
  crop: string;
  quantity: number;
  unit: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  progress: number;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  deliveryTime?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShipmentSchema: Schema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: 'kg' },
    status: {
      type: String,
      enum: ['processing', 'in-transit', 'delivered', 'cancelled'],
      default: 'processing',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    estimatedDelivery: { type: Date, required: true },
    actualDelivery: { type: Date },
    deliveryTime: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

ShipmentSchema.index({ farmerId: 1, status: 1 });
ShipmentSchema.index({ farmerId: 1, createdAt: -1 });

export const Shipment = mongoose.model<IShipment>('Shipment', ShipmentSchema);
