import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class createOfferDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  expiry: Date;

  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  category_id: string;  

  @IsNotEmpty()
  @IsString()
  contact:string; 
}
