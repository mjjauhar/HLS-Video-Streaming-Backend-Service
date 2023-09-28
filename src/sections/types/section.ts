import { Document, Types } from 'mongoose';

export interface section extends Document {
  title: string;
  duration: number;
  lectures: Types.ObjectId;
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
