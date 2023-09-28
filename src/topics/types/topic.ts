import { Document, Types } from 'mongoose';

export interface topic extends Document {
  name: string;
  description: string;
  sub_category: Types.ObjectId;
}
