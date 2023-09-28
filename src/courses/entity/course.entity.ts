import { Types } from 'mongoose';

export class Course {
  title: string;
  description: string;
  faculty: Types.ObjectId;
  price: number;
  duration: number;
}
