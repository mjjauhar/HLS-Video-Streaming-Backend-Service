import { Types } from 'mongoose';

export class CreateSubCategoryDto {
  name: string;
  description: string;
  main_category: Types.ObjectId;
}
