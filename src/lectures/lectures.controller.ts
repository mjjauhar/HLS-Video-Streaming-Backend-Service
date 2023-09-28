import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import { FacultiesService } from 'src/faculties/faculties.service';

@Controller('lectures')
export class LecturesController {
  constructor(
    private readonly lecturesService: LecturesService,
    private readonly facultyService: FacultiesService,
  ) {}

  //CREATE A NEW LECTURE UNDER A SECTION
  @Post('')
  @Permissions(Permission.ACCESS_CONTENT)
  async create(
    // @Param('section_id') section_id: string,
    @Body() createLectureDto: CreateLectureDto,
    @Req() req
  ) {
    await this.facultyService.checkIfFaculty(req.user_id);
    return this.lecturesService.create(createLectureDto.section_id, createLectureDto);
  }

  //GET ALL NON-BLOCKED LECTURES
  @Get()
  @Permissions(
    Permission.CREATE_COURSES,
    Permission.MANAGE_COURSES,
    Permission.ACCESS_CONTENT,
  )
  findAll() {
    return this.lecturesService.findAll();
  }

  //GET A NON-BLOCKED LECTURES
  @Get(':lecture_id')
  @Permissions(
    Permission.CREATE_COURSES,
    Permission.MANAGE_COURSES,
    Permission.ACCESS_CONTENT,
  )
  findOne(@Param('lecture_id') lecture_id: string) {
    return this.lecturesService.findOne(lecture_id);
  }

  //EDIT A LECTURE
  @Patch(':lecture_id')
  @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  update(
    @Param('lecture_id') lecture_id: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    return this.lecturesService.update(lecture_id, updateLectureDto);
  }

  //DELETE A LECTURE
  @Delete(':lecture_id/:section_id')
  @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  remove(
    @Param('lecture_id') lecture_id: string,
    @Param('section_id') section_id: string,
  ) {
    return this.lecturesService.remove(lecture_id, section_id);
  }
}
