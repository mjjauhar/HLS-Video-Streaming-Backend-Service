import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateEnrollmentDto {
  student: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  password: string; 

  @IsNotEmpty()
  @IsString()
  course: Types.ObjectId;
  enrollment_date: Date;
  status: number;
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
