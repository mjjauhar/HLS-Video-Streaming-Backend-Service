import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  faculty: string;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  // @IsNotEmpty()
  // @IsNumber()
  duration: number;
}
