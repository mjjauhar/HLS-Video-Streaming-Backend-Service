import { Document } from 'mongoose';

export interface main_category extends Document {
  name: string;
  description: string;
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
