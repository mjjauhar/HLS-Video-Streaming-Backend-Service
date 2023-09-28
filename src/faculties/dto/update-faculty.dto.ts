import { PartialType } from '@nestjs/mapped-types';
import { CreateFacultyDto } from './create-faculty.dto';
import { Types } from 'mongoose';

export class UpdateFacultyDto extends PartialType(CreateFacultyDto) {
  courses: Types.ObjectId;
  ratings: Types.ObjectId;
}
