import { HttpException, Injectable } from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lecture } from './types';
import { section } from 'src/sections/types';

@Injectable()
export class LecturesService {
  constructor(
    @InjectModel('lecture') private lectureModel: Model<lecture>,
    @InjectModel('section') private sectionModel: Model<section>,
  ) {}

  //CREATE A NEW LECTURE UNDER A SECTION
  async create(section_id: string, createLectureDto: CreateLectureDto) {
    try {
      const createLecture = new this.lectureModel(createLectureDto);
      await this.sectionModel.updateOne(
        { _id: section_id },
        { $addToSet: { lectures: createLecture._id } },
      );
      return await createLecture.save();
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET ALL NON-BLOCKED LECTURES
  async findAll() {
    try {
      return await this.lectureModel.find({status: 2}).populate('video');
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED LECTURE
  async findOne(lecture_id: string) {
    try {
      return await this.lectureModel
        .findOne({ _id: lecture_id, status: 2 })
        .populate('video');
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //UPDATE A LECTURE
  async update(lecture_id: string, updateLectureDto: UpdateLectureDto) {
    try {
      return await this.lectureModel.updateOne(
        { _id: lecture_id },
        { $set: { updateLectureDto } },
      );
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //REMOVE A LECTURE
  async remove(lecture_id: string, section_id: string) {
    try {
      await this.sectionModel.updateOne(
        { _id: section_id },
        {
          $pullAll: {
            lectures: [lecture_id],
          },
        },
      );
      return await this.lectureModel.deleteOne({ _id: lecture_id });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }
}
