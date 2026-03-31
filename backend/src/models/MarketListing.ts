import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketListing extends Document {
  farmerId: mongoose.Types.ObjectId;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  quality: string;
  location: string;
  harvestDate: Date;
  certifications: string[];
  description?: string;
  status: 'active' | 'sold' | 'expired' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const MarketListingSchema: Schema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true, trim: true },
    variety: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: 'kg' },
    price: { type: Number, required: true, min: 0 },
    quality: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    harvestDate: { type: Date, required: true },
    certifications: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'sold', 'expired', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

MarketListingSchema.index({ farmerId: 1, status: 1 });
MarketListingSchema.index({ crop: 1, status: 1 });
MarketListingSchema.index({ location: 1 });

export const MarketListing = mongoose.model<IMarketListing>('MarketListing', MarketListingSchema);
