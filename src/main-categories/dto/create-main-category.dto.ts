import { IsNotEmpty } from "class-validator";

export class CreateMainCategoryDto {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  description: string;
}
