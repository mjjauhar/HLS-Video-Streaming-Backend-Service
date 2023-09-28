import { Document, Types } from 'mongoose';

export interface faculty extends Document {
  user_id: Types.ObjectId;
  expertise: Types.ObjectId;
  courses: Types.ObjectId;
  ratings: Types.ObjectId;
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
