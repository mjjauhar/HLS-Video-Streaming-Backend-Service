import { Document, Types } from 'mongoose';

export interface student extends Document {
  user_id: Types.ObjectId;
  enrollments: Types.ObjectId;
  status: number;
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
