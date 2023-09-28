import { IsNotEmpty } from "class-validator";

export class CreateRoleDTO {
  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  description: string;
}
