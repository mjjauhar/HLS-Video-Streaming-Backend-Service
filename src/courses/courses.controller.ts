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
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto';
import { UpdateCourseDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import { Payload } from 'src/auth/type';
import jwtDecode from 'jwt-decode';
import { thumbnailUploadInterceptor } from 'src/shared/helper';
import { FacultiesService } from 'src/faculties/faculties.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly facultySerivce: FacultiesService,
  ) { }

  //CREATE NEW COURSE
  @Post()
  @Permissions(Permission.ACCESS_CONTENT)
  async create(@Request() req: any, @Body() createCourseDto: CreateCourseDto) {
    createCourseDto.faculty = req.user_id;
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.coursesService.create(createCourseDto,req.user_id);
  }

  //GET ALL COURSES (WITH PAGINATION)
  @Get()
  @Permissions(Permission.ACCESS_CONTENT)
  findAll(@Query() query: { page: number; limit: number }) {
    return this.coursesService.findAll(query.page, query.limit);
  }

  //GET A COURSE
  @Get('/single/:course_id')
  @Permissions(Permission.ACCESS_CONTENT)
  findOne(@Param('course_id') course_id: string,@Req() request:any) {
    return this.coursesService.findOne(course_id,request.user_id);
  }

  //PUBLISH A COURSE
  @Patch('publish/:course_id')
  @Permissions(Permission.ACCESS_CONTENT)
  async publish(
    @Param('course_id') course_id: string,
    @Request() req: any,) {
    const result: Payload = await jwtDecode(req.headers.authorization);
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.coursesService.publish(course_id, result.loyalty_token);
  }

  //UPDATE/EDIT A COURSE
  @Patch(':course_id')
  @Permissions(Permission.ACCESS_CONTENT)
  async update(
    @Param('course_id') course_id: string,
    @Request() req: any,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.coursesService.update(course_id, req.user_id, updateCourseDto);
  }

  //DELETE A COURSE
  @Delete(':course_id')
  @Permissions(Permission.ACCESS_CONTENT)
  async remove(@Param('course_id') course_id: string, @Request() req: any) {
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return this.coursesService.remove(course_id, req.user_id);
  }

  //GET LATEST COURSE 
  @Get('/latest')
 async getLatestCourse(){
    return this.coursesService.getLatestCourses()
  }

  //GET LATEST COURSE 
  @Get('/popular')
  getPopularCourse(){
    return this.coursesService.getPopularCourses()
  }

  //COURSE SEATCH 
  @Post('/search')
  getSearchResult(@Body('keyword') keyword:string){
    return this.coursesService.searchCourse(keyword)
  }

  @Patch('/add-thumbnail/:course_id')
  @UseInterceptors(thumbnailUploadInterceptor())
  @Permissions(Permission.ACCESS_CONTENT)
  async addThumbnail(@Param('course_id') course_id: string, @UploadedFile() file: Express.Multer.File,@Req() req) {
    await this.facultySerivce.checkIfFaculty(req.user_id)
    return await this.coursesService.addThumbnail(course_id, file.filename);
  }

  @Get('/get-courses-topic')
  getCourseByTopic(@Query('id') id:string){
    return this.coursesService.getCoursesByTopic(id)
  }

  @Get('/get-my-learning')
  @Permissions(Permission.ACCESS_CONTENT)
  getMyLearning(@Request() req: any){
    console.log(req.user_id);
    return this.coursesService.getMyLearning(req.user_id)
  }

  @Get('/lectures/:course')
  @Permissions(Permission.ACCESS_CONTENT)
  getCouserLectures(@Param('course') course_id:string,@Req() request:any){
    return this.coursesService.getCourseLectures(request.user_id,course_id)
  }
}
