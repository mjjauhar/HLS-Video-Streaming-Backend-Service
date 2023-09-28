import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { CreateVideoDto, UpdateVideoDto } from './dto';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';
import { thumbnailUploadInterceptor } from './helper';
import { ClearVideoTempFiles } from './helper/clear-video-temp-files';
import { FacultiesService } from 'src/faculties/faculties.service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly facultySerivce: FacultiesService,
  ) {}

  // >> UPLOAD NEW VIDEO
  @Post(':lecture_id')
  // @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  @Permissions(Permission.ACCESS_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  async transcode(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 5e6 }),
          new FileTypeValidator({ fileType: 'video/mp4' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('lecture_id') lecture_id: string,
    @Body() createVideoDto: CreateVideoDto,
    @Req() req,
  ) {
    try {
      await this.facultySerivce.checkIfFaculty(req.user_id);
      if (!file) {
        throw new HttpException(
          'No input file received. Please send video file in file in application/form-data format.',
          HttpStatus.NOT_FOUND,
        );
      }
      console.log('createVideoDto==>', createVideoDto);
      await this.videosService.transcode(file, lecture_id, createVideoDto,req.user_id);
      return { message: 'Video upload in progress' };
      //Save video_url to DB
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    } finally {
      // ClearVideoTempFiles();
      console.log('finally run');
    }
  }

  @Get('aws/:video_id/:lecture_id/:title/:description/:userid')
  async uploadVideo(
    @Param('video_id') video_id: string,
    @Param('lecture_id') lecture_id: string,
    @Param('title') title: string,
    @Param('description') description: string,
    @Param('userid') userid: string,
  ) {
    try {
      if (!video_id) {
        throw new HttpException(
          'Missing required video id.',
          HttpStatus.NOT_FOUND,
        );
      }
      console.log(
        'video_id==>',
        video_id,
        'lecture_id==>',
        lecture_id,
        'title==>',
        title,
        'description==>',
        description,
      );
      console.log('##########|before video|##########');
      const video = await this.videosService.awsBucketVideoUpload(
        video_id,
        lecture_id,
        title,
        description,
        userid
      );
      return video;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    } finally {
      // ClearVideoTempFiles();
      console.log('finally run');
    }
  }

  //get video details
  @Get(':video_id')
  // @Permissions(
  // Permission.CREATE_COURSES,
  // Permission.MANAGE_COURSES,
  // Permission.ACCESS_CONTENT,
  // )
  async findOne(@Param('video_id') video_id: string) {
    return await this.videosService.findOne(video_id);
  }

  @Patch('thumbnail/:folder_id')
  @UseInterceptors(thumbnailUploadInterceptor())
  async thumbnail(
    @Param('folder_id') folder_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    return await this.videosService.thumbnail(folder_id, file.filename);
  }

  //Edit Video info
  @Patch(':video_id')
  // @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  @Permissions(Permission.ACCESS_CONTENT)
  async updateOne(
    @Param('video_id') video_id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @Req() request,
  ) {
    await this.facultySerivce.checkIfFaculty(request.user_id);
    await this.videosService.updateOne(video_id, updateVideoDto);
  }

  //Delete a video
  @Delete()
  @Permissions(Permission.CREATE_COURSES, Permission.MANAGE_COURSES)
  async deleteOne(@Query() query: { video_id: string; lecture_id: string }) {
    return await this.videosService.deleteOne(query.video_id, query.lecture_id);
  }
}
