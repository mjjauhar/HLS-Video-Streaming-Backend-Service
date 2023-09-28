import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Req,
} from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { CreateFacultyDto, UpdateFacultyDto } from './dto';
import { AdminService } from '../admin/admin.service';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  //SEND REQUEST TO ADMIN TO GET APPROVED TO BECOME A FACULTY
  //(ie. create faculty collecton for this user but status is 1)
  @Post()
  @Permissions(Permission.ACCESS_CONTENT)
  create(@Body() dto: CreateFacultyDto, @Request() req: any) {
    return this.facultiesService.create(req.user_id, dto.expertise);
  }

  //GET ALL FACULTIES INFO
  @Get()
  @Permissions(Permission.ACCESS_CONTENT, Permission.MANAGE_USERS)
  findAll() {
    return this.facultiesService.findAll();
  }

  //GET A FACULTY
  @Get('single/:faculty_id')
  @Permissions(Permission.ACCESS_CONTENT, Permission.MANAGE_USERS)
  findOne(@Param('faculty_id') faculty_id: string) {
    return this.facultiesService.findOne(faculty_id);
  }

  //SELF EDIT FACULTY INFO/PROFILE
  @Patch(':id')
  @Permissions(Permission.MANAGE_USERS, Permission.CREATE_COURSES)
  //TODO: verify If the user logged in user is a faculty or not and only allow self edit to user other than admin
  update(
    @Param('faculty_id') faculty_id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    return this.facultiesService.update(faculty_id, updateFacultyDto);
  }

  //REMOVE / DELETE FACULTY
  @Delete(':faculty_id')
  @Permissions(Permission.MANAGE_USERS, Permission.CREATE_COURSES)
  //TODO: verify If the user logged in is a faculty or not and only allow self delete to user other than admin
  remove(@Param('faculty_id') faculty_id: string) {
    return this.facultiesService.remove(faculty_id);
  }

  @Get('faculty-requests')
  // @Permissions(Permission.MANAGE_ROLES)
  getFacultyRequests() {
    return this.facultiesService.getFacultyRequests();
  }

  @Get('/profile')
  @Permissions(Permission.ACCESS_CONTENT)
  getFacultyProfile(@Req() request) {
    return this.facultiesService.getFacultyProfile(request.user_id);
  }

  @Get('/profile-user/:id')
  getFalutyProfileForUsers(@Param('id') id:string){
    console.log(id);
    
    return this.facultiesService.getFacultyProfileForUser(id)
  }
}
