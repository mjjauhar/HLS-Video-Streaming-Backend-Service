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
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import jwtDecode from 'jwt-decode';
import { Payload } from 'src/auth/type';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  //ENROLL or PURCHASE A COURSE
  @Post()
  @Permissions(Permission.ENROLL_COURSES)
  async enroll(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Request() req: any,
  ) {
    const result: Payload = await jwtDecode(req.headers.authorization);
    createEnrollmentDto.student = result.user_id;
    return await this.enrollmentsService.enroll(
      createEnrollmentDto,
      result.loyalty_token,
    );
  }

  //GET ALL ENROLLED COURSES
  @Get()
  @Permissions(Permission.ENROLL_COURSES)
  findAll(@Request() req: any) {
    return this.enrollmentsService.findAll(req.user_id);
  }

  //GET A ENROLLED COURSE
  @Get(':enrollment_id')
  @Permissions(Permission.ENROLL_COURSES)
  findOne(@Param('enrollment_id') enrollment_id: string, @Request() req: any) {
    return this.enrollmentsService.findOne(enrollment_id, req.user_id);
  }

  //TODO
  @Patch(':enrollment_id')
  @Permissions(Permission.ENROLL_COURSES)
  update(
    @Param('enrollment_id') enrollment_id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(enrollment_id, updateEnrollmentDto);
  }

  //TODO
  @Delete(':enrollment_id')
  @Permissions(Permission.ENROLL_COURSES, Permission.MANAGE_USERS)
  remove(@Param('enrollment_id') enrollment_id: string) {
    return this.enrollmentsService.remove(enrollment_id);
  }
}
