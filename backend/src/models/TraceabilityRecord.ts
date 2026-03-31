import mongoose, { Document, Schema } from 'mongoose';

interface ISupplyChainStage {
  stage: string;
  location: string;
  date: Date;
  status: string;
  details: string;
}

interface IQualityTest {
  type: string;
  result: string;
  date: Date;
}

export interface ITraceabilityRecord extends Document {
  productId: string;
  farmerId: mongoose.Types.ObjectId;
  crop: string;
  batch: string;
  farm: string;
  harvestDate: Date;
  quality: string;
  certifications: string[];
  supplyChain: ISupplyChainStage[];
  tests: IQualityTest[];
  status: 'Active' | 'Completed' | 'Recalled';
  createdAt: Date;
  updatedAt: Date;
}

const SupplyChainStageSchema = new Schema({
  stage: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  details: { type: String },
}, { _id: false });

const QualityTestSchema = new Schema({
  type: { type: String, required: true },
  result: { type: String, required: true },
  date: { type: Date, required: true },
}, { _id: false });

const TraceabilityRecordSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    farm: { type: String, required: true, trim: true },
    harvestDate: { type: Date, required: true },
    quality: { type: String, required: true },
    certifications: [{ type: String, trim: true }],
    supplyChain: [SupplyChainStageSchema],
    tests: [QualityTestSchema],
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Recalled'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

TraceabilityRecordSchema.index({ farmerId: 1, status: 1 });
TraceabilityRecordSchema.index({ productId: 1 });

export const TraceabilityRecord = mongoose.model<ITraceabilityRecord>(
  'TraceabilityRecord',
  TraceabilityRecordSchema
);
