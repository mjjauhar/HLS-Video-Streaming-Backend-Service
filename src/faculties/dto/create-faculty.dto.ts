import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFacultyDto {
  user_id: Types.ObjectId;

  // @IsNotEmpty()
  expertise: string;
}
