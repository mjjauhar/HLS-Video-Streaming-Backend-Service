import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto';
import { UpdateSectionDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import { FacultiesService } from 'src/faculties/faculties.service';

@Controller('sections')
export class SectionsController {
  constructor(
    private readonly sectionsService: SectionsService,
    private readonly facultySerivce: FacultiesService,
  ) {}

  //CREATE A NEW SECTION UNDER A COURSE
  @Post('')
  // @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  @Permissions(Permission.ACCESS_CONTENT)
  async create(
    @Body() createSectionDto: CreateSectionDto,
    @Request() req: any,
    // @Param('course_id') course_id: string,
  ) {
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.sectionsService.create(
      createSectionDto,
      req.user_id,
    );
  }

  //GET ALL NON-BLOCKED SECTIONS
  @Get()
  @Permissions(Permission.ACCESS_CONTENT, Permission.MANAGE_COURSES)
  findAll() {
    return this.sectionsService.findAll();
  }

  //GET A NON-BLOCKED SECTION
  @Get(':section_id')
  @Permissions(Permission.ACCESS_CONTENT, Permission.MANAGE_COURSES)
  findOne(@Param('section_id') section_id: string) {
    return this.sectionsService.findOne(section_id);
  }

  //EDIT A SECTION
  @Patch(':section_id')
  @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  update(
    @Request() req: any,
    @Param('section_id') section_id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(
      section_id,
      req.user_id,
      updateSectionDto,
    );
  }

  //DELETE A SECTION
  @Delete(':section_id')
  // @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  @Permissions(Permission.ACCESS_CONTENT)
  async remove(@Param('section_id') section_id: string, @Request() req: any) {
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.sectionsService.remove(section_id, req.user_id);
  }
}
