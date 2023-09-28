import { Document } from 'mongoose';

export interface rule extends Document {
  name: string;
  description: string;
  rule: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
