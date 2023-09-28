import { IsNotEmpty } from "class-validator";

export class CreateLectureDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  section_id:string

  content: string;
  duration: string;
  video: string;
}
