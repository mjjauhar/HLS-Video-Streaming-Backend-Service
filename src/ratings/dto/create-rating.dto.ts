import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;
  
  comment: string;
  user: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  ip_address: string;
}
