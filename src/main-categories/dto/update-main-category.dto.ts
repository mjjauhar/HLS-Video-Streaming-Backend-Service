import { PartialType } from '@nestjs/mapped-types';
import { CreateMainCategoryDto } from './create-main-category.dto';

export class UpdateMainCategoryDto extends PartialType(CreateMainCategoryDto) {}
