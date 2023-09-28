import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  //GET ALL NON-BLOCKED STUDENTS
  @Get()
  @Permissions(Permission.MANAGE_USERS)
  findAll() {
    return this.studentsService.findAll();
  }

  //GET A NON-BLOCKED STUDENT
  @Get(':student_id')
  @Permissions(Permission.MANAGE_USERS)
  //TODO a student can see self details
  findOne(@Param('student_id') student_id: string) {
    return this.studentsService.findOne(student_id);
  }

  //UPDATE A STUDENT
  @Patch(':student_id')
  @Permissions(Permission.MANAGE_USERS)
  //TODO a student can self edit
  update(@Param('student_id') student_id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(student_id, updateStudentDto);
  }

  // DELETE A STUDENT
  @Delete(':student_id')
  @Permissions(Permission.MANAGE_USERS)
  //TODO a student can self delete
  remove(@Param('student_id') student_id: string) {
    return this.studentsService.remove(student_id);
  }
}
