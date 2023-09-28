import { Document, Types } from 'mongoose';

export interface approve_faculty extends Document {
  user_id: Types.ObjectId;
  is_approved: boolean;
  reviewed_admin: Types.ObjectId;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
