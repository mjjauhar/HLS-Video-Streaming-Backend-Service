import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MainCategoriesService } from './main-categories.service';
import { CreateMainCategoryDto } from './dto/create-main-category.dto';
import { UpdateMainCategoryDto } from './dto/update-main-category.dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('main-categories')
export class MainCategoriesController {
  constructor(private readonly mainCategoriesService: MainCategoriesService) {}

  //CREATE A NEW MAIN CATEGORY
  @Post()
  @Permissions(Permission.MANAGE_CATEGORIES)
  create(@Body() createMainCategoryDto: CreateMainCategoryDto) {
    return this.mainCategoriesService.create(createMainCategoryDto);
  }

  //GET ALL NON-BLOCKED MAIN CATEGORIES
  @Get()
  findAll() {
    return this.mainCategoriesService.findAll();
  }

  //GET ALL NON-BLOCKED COURSES IN A MAIN CATEGORY
  @Get('courses/:main_category_id')
  findAllCourses(@Param('main_category_id') main_category_id: string){
    return this.mainCategoriesService.findAllCourses(main_category_id)
  }

  //GET A NON-BLOCKED MAIN CATEGORY
  @Get('get/:main_category_id')
  findOne(@Param('main_category_id') main_category_id: string) {
    return this.mainCategoriesService.findOne(main_category_id);
  }

  //EDIT A MAIN CATEGORY
  @Patch('get/:main_category_id')
  @Permissions(Permission.MANAGE_CATEGORIES)
  update(
    @Param('main_category_id') main_category_id: string,
    @Body() updateMainCategoryDto: UpdateMainCategoryDto,
  ) {
    return this.mainCategoriesService.update(main_category_id, updateMainCategoryDto);
  }

  //DELETE A MAIN CATEGORY
  @Delete('get/:main_category_id')
  @Permissions(Permission.MANAGE_CATEGORIES)
  remove(@Param('main_category_id') main_category_id: string) {
    return this.mainCategoriesService.remove(main_category_id);
  }

  //GET TOPIC FROM MAIN CATEGORIES 
  @Get('/get-topic')
  getTopics(@Query('id') id:string){
    return this.mainCategoriesService.getTopics(id)
  }
}
