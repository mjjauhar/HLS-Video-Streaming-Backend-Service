import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { Types } from 'mongoose';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  courses: Types.ObjectId;
  status: string;
  updated_at: Date;
}
