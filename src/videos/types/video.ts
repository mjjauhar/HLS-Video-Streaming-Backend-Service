import { Document } from 'mongoose';

export interface video extends Document {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  folder_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
