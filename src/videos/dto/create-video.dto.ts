import { IsNotEmpty } from "class-validator";

export class CreateVideoDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  url: string;
  folder_id: string;
  thumbnail: string;
}
