import { Document, Types } from 'mongoose';

export interface role extends Document {
  name: string;
  description: string;
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  status: number;
  permissions: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
