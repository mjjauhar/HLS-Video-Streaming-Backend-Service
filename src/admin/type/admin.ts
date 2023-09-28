import { Document, Types } from 'mongoose';

export interface admin extends Document {
  user_id: Types.ObjectId;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
