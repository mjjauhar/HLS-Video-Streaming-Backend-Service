import { Document, Types } from 'mongoose';

export interface lecture extends Document {
  title: string;
  content: string;
  duration: number;
  video: Types.ObjectId;
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
