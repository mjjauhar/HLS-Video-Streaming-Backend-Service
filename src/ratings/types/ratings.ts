import { Document, Types } from 'mongoose';

export interface rating extends Document {
  rating: number;
  comment: string;
  user: Types.ObjectId;
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
