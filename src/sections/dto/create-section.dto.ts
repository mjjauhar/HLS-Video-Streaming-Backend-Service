import { IsNotEmpty, IsString } from "class-validator";

export class CreateSectionDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  course_id:string

  duration: number;
  lectures: string;
}
