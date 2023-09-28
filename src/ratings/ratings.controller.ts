import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto';
import { UpdateRatingDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  //CREATE A NEW RATING
  @Post()
  @Permissions(Permission.ENROLL_COURSES, Permission.ACCESS_CONTENT)
  create(
    @Body() createRatingDto: CreateRatingDto,
    @Request() req: any,
    @Query() query: { give_rating_to: string },
  ) {
    createRatingDto.user = req.user_id;
    if (createRatingDto.rating > 5 || createRatingDto.rating < 1) {
      throw new HttpException(
        'rating should be between 1 to 5',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    return this.ratingsService.create(createRatingDto, query.give_rating_to);
  }

  //GET ALL NON-BLOCKED RATINGS
  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }

  //GET A NON-BLOCKED RATING
  @Get(':rating_id')
  findOne(@Param('rating_id') rating_id: string) {
    return this.ratingsService.findOne(rating_id);
  }

  //EDIT A RATING
  @Patch(':rating_id')
  @Permissions(Permission.ENROLL_COURSES, Permission.ACCESS_CONTENT)
  update(
    @Param('rating_id') rating_id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() req: any,
  ) {
    if (updateRatingDto.rating > 5 || updateRatingDto.rating < 1) {
      throw new HttpException(
        'rating should be between 1 to 5',
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
    return this.ratingsService.update(rating_id, updateRatingDto, req.user_id);
  }

  //DELETE A RATING
  @Delete(':rating_id')
  @Permissions(
    Permission.ENROLL_COURSES,
    Permission.ACCESS_CONTENT,
    Permission.MANAGE_CONTENT,
  )
  remove(@Param('rating_id') rating_id: string, @Request() req: any) {
    return this.ratingsService.remove(rating_id, req.user_id);
  }
}
