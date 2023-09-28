import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVideoDto, UpdateVideoDto } from './dto';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { deleteFile } from 'src/shared/helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { video } from './types';
import { lecture } from 'src/lectures/types';
import { rule } from 'src/rules/schema';
import { createReadStream, readdir, mkdirSync, writeFileSync } from 'fs';
import { getDetailedVideoInfo } from './helper/get-detailed-video-info';
import { extension } from 'mime-types';
import { VALID_VIDEO_EXTENSIONS } from './entities';
import { v4 as uuidv4 } from 'uuid';
import { resolve } from 'path';
import { spawn } from 'child_process';
import axios from 'axios';
import { section } from '../sections/types'
import { course } from '../courses/types'
import { FacultiesService } from 'src/faculties/faculties.service';
import { ClearVideoTempFiles } from './helper/clear-video-temp-files';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel('video') private videoModel: Model<video>,
    @InjectModel('lecture') private lectureModel: Model<lecture>,
    @InjectModel('rule') private ruleModel: Model<rule>,
    @InjectModel('course') private courseModel: Model<course>,
    private readonly configService: ConfigService,
    private readonly facultyService: FacultiesService,
  ) { }
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  async awsBucketVideoUpload(video_id: string, lecture_id: string, title: string, description: string, userid: string) {
    console.log('<<===<<======|inside awsBucketVideoUpload|=====>>===>>');
    console.log('<<===<<======|1|=====>>===>>');
    const bucket_name = this.configService.get<string>('AWS_S3_BUCKET');
    const aws_s3_folder_path = this.configService.get<string>('AWS_S3_FOLDER_PATH');
    const folder_path = `${aws_s3_folder_path}/${video_id}`;

    readdir(`temp/hls/${video_id}`, (err, files) => {
      if (err) {
        throw new HttpException(
          `Failed to list directory => ${err}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      files.forEach(async (file) => {
        const command: PutObjectCommand = new PutObjectCommand({
          Bucket: bucket_name,
          Key: `${folder_path}/${file}`,
          Body: createReadStream(`temp/hls/${video_id}/` + file),
        });

        console.log(file);
        await this.s3Client.send(command);
        console.log(`<<===<<======|${file} uploaded|=====>>===>>`);
        // if (file !== 'manifest.m3u8') {
        //   await deleteFile(`temp/uploads/hls/${file}`);
        //   console.log(`<<===<<======|${file} deleted from local|=====>>===>>`);
        // }
      });
    });

    console.log('<<===<<======|4|=====>>===>>');
    // remove the local folder
    // trigger uploading the contents of video into s3 bucket now
    console.log('<<===<<======|5|=====>>===>>');
    const video_url = `https://${bucket_name}.s3.ap-south-1.amazonaws.com/${folder_path}/playlist.m3u8`;
    const createVideo = new this.videoModel({
      title,
      description,
      url: video_url,
      folder_id: video_id,
    });
    await this.lectureModel.updateOne(
      { _id: lecture_id },
      { $set: { video: createVideo._id } },
    );

    console.log('>>=======createVideo======>>', createVideo);
    const facultyData = await this.facultyService.getFacultyProfile(userid)
    console.log("facultyData==========>", facultyData)
    console.log("userid==========>", userid)
    await createVideo.save();
    ClearVideoTempFiles()
    return video_url;
    // Save this to DB ==============================================
  }

  async transcode(file: Express.Multer.File, lecture_id: string, createVideoDto: CreateVideoDto, user_id: string) {
    try {
      // console.log('file inside video service transcode====>>', file);
      console.log('createVideoDto inside video service transcode====>>');
      const { buffer, mimetype } = file;
      const file_extension = extension(mimetype);
      /*
        Check for extension
      */
      if (!file_extension || !VALID_VIDEO_EXTENSIONS.includes(file_extension)) {
        return new HttpException(
          'Video format is not supported', HttpStatus.NOT_ACCEPTABLE,
        );
      }
      // generare the unique id for this video.
      const video_id = uuidv4();
      /*
        Save the incoming file in uploads folder
      */
      mkdirSync(resolve('temp/uploads', video_id));
      const video_file_path = resolve('temp/uploads', video_id, `${video_id}.${file_extension}`);
      writeFileSync(video_file_path, buffer);
      console.log('========> here <=======')
      const video_info = await getDetailedVideoInfo(video_file_path);
      // console.log(video_info);
      const video_length = video_info.streams[0].duration;
      console.log(video_length);
      const allowed_vid_length = await this.ruleModel.findOne({
        name: 'lecture video max length',
      });
      if (video_length > parseInt(allowed_vid_length.rule)) {
        const result = await deleteFile(video_file_path);
        if (result === undefined) {
          return new HttpException(
            `Video length should be less than ${allowed_vid_length.rule} seconds`,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      }

      const bucket_name = this.configService.get<string>('AWS_S3_BUCKET');
      const folder_path = this.configService.get<string>('AWS_S3_FOLDER_PATH');
      const S3_URL = `https://${bucket_name}.s3.ap-south-1.amazonaws.com/${folder_path}`
      const create_hls_vod = '/home/mjauhar/Downloads/27-academy/src/videos/helper/create-hls-vod.sh';
      const title = createVideoDto.title.replace(/ /g, "%20");
      const description = createVideoDto.description.replace(/ /g, "%20");
      console.log(title, '<<===>>', description);
      // exec(`.././create-hls-vod.sh ${video_id} ${extension} ${S3_BUCKET}`);
      const createHLSVOD = spawn('bash', [create_hls_vod, video_id, file_extension, S3_URL, lecture_id, title, description, user_id]);
      createHLSVOD.stdout.on('data', d => console.log(`stdout info: ${d}`));
      createHLSVOD.stderr.on('data', d => console.log(`stderr error: ${d}`));
      createHLSVOD.on('error', d => console.log(`error: ${d}`));
      createHLSVOD.on('close', code => console.log(`child process ended with code ${code}`));
      return { message: "uploaded successfull" }
    } catch (error) {
      return new HttpException(error, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async findOne(video_id: string) {
    try {
      return await this.videoModel.findOne({ _id: video_id });
    } catch (error) {
      throw new HttpException(error, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async thumbnail(folder_id: string, file: string) {
    try {
      const bucket_name = this.configService.get<string>('AWS_S3_BUCKET');
      const aws_s3_folder_path = this.configService.get<string>('AWS_S3_FOLDER_PATH');
      const folder_path = `${aws_s3_folder_path}/${folder_id}`;

      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket_name,
        Key: `${folder_path}/${file}`,
        Body: createReadStream(`temp/thumbnail/` + file),
      });

      console.log(file);
      await this.s3Client.send(command);

      const thumbnail_url = `https://${bucket_name}.s3.ap-south-1.amazonaws.com/${folder_path}/${file}`;
      console.log(thumbnail_url);
      return await this.videoModel.updateOne({ folder_id }, { $set: { thumbnail: thumbnail_url } });
    } catch (error) {
      throw new HttpException(error, 400, {
        cause: new Error(error.message),
      })
    }
  }

  async updateOne(video_id: string, updateVideoDto: UpdateVideoDto) {
    return await this.videoModel.updateOne(
      { _id: video_id },
      { $set: updateVideoDto },
    );
  }

  async deleteOne(video_id: string, lecture_id: string) {
    try {
      const video = await this.videoModel.findOne({ _id: video_id });
      if (video) {
        const removeFromStorage = await deleteFile(video.url);

        if (removeFromStorage === undefined) {
          await this.lectureModel.updateOne(
            { _id: lecture_id, video: video_id },
            { $unset: { video: 1 } },
          );
          return await this.videoModel.deleteOne({ _id: video_id });
        }
      } else {
        return new HttpException('Video Not Found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(error, 400, {
        cause: new Error(error.message),
      });
    }
  }
}
