import { Types } from 'mongoose';

export interface enrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  enrollment_date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
