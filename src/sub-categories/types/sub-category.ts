import { Document, Types } from 'mongoose';

export interface SubCategory extends Document {
  name: string;
  description: string;
  main_category: Types.ObjectId;
}
