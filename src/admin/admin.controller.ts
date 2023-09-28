import {
  Controller,
  Post,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //ADD NEW ADMIN
  @Post('add/:user_id')
  @Permissions(Permission.MANAGE_ROLES)
  addAdmin(@Param('user_id') user_id: string) {
    return this.adminService.addAdmin(user_id);
  }

  //BLOCK STUDENT
  @Patch('block-student/:student_id')
  @Permissions(Permission.MANAGE_USERS)
  blockStudent(@Param('student_id') student_id: string) {
    return this.adminService.blockStudent(student_id);
  }

  //UNBLOCK STUDENT
  @Patch('unblock-student/:student_id')
  @Permissions(Permission.MANAGE_USERS)
  unblockStudent(@Param('student_id') student_id: string) {
    return this.adminService.unblockStudent(student_id);
  }

  //BLOCK FACULTY
  @Patch('block-faculty/:faculty_id')
  @Permissions(Permission.MANAGE_USERS)
  blockFaculty(@Param('faculty_id') faculty_id: string) {
    return this.adminService.blockFaculty(faculty_id);
  } 

  //UNBLOCK FACULTY
  @Patch('unblock-faculty/:id')
  @Permissions(Permission.MANAGE_USERS)
  unblockFaculty(@Param('id') id: string) {
    return this.adminService.unblockFaculty(id);
  }

  //APPROVE FACULTY
  @Patch('approve-faculty/:user_id')
  @Permissions(Permission.ACCESS_CONTENT)
  approveFacultyRequest(
    @Request() req: any,
    @Param('user_id') user_id: string
  ) {
    return this.adminService.acceptFacultyApprovalRequest(
      user_id,
      req.user_id,
    );
  }
}
