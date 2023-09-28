import { Types } from 'mongoose';

export class CreateTopicDto {
  name: string;
  description: string;
  sub_category: Types.ObjectId;
}
