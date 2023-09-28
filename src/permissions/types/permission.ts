import { Document } from 'mongoose';

export interface permission extends Document {
  name: string;
  description: string;
  status: number;
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
