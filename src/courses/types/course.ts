import { Document, Types } from 'mongoose';

export interface course extends Document {
  title: string;
  description: string;
  faculty: Types.ObjectId;
  topic: Types.ObjectId;
  price: number;
  duration: number;
  sections: Types.ObjectId;
  students: Types.ObjectId;
  ratings: Types.ObjectId;
  status: number;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
  thumbnail:string
}
