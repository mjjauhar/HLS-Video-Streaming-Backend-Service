import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { section } from './types';
import { course } from 'src/courses/types';
import { faculty } from 'src/faculties/type';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel('section') private sectionModel: Model<section>,
    @InjectModel('course') private courseModel: Model<course>,
    @InjectModel('faculty') private facultyModel: Model<faculty>,
  ) {}

  //CREATE NEW SECTION UNDER A COURSE
  async create(
    createSectionDto: CreateSectionDto,
    user_id: string,
    // course_id: string,
  ) {
    try {
      const faculty = await this.facultyModel.findOne({
        user_id,
      });
      if (!faculty) {
        throw new HttpException(
          'You are not a faculty. Access denied',
          HttpStatus.FORBIDDEN,
        );
      }
      const course = await this.courseModel.findOne({_id:createSectionDto.course_id})
      // if(course.faculty!==faculty._id) 
      const createSection = new this.sectionModel(createSectionDto);

      await this.courseModel.updateOne(
        { _id: createSectionDto.course_id, faculty: faculty._id },
        { $addToSet: { sections: createSection._id } },
      );

      createSection.save();
      return createSection;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET ALL NON-BLOCKED SECTIONS
  async findAll() {
    try {
      return await this.sectionModel.find({status: 2});
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED SECTION
  async findOne(section_id: string) {
    try {
      return await this.sectionModel
        .findOne({ _id: section_id, status: 2 })
        .populate('lectures');
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //UPDATE A SECTION
  async update(
    section_id: string,
    user_id: string,
    updateSectionDto: UpdateSectionDto,
  ) {
    try {
      const faculty = await this.facultyModel.findOne({ user_id });
      const course = await this.courseModel.findOne({
        faculty: faculty._id,
        sections: section_id,
      });
      if (!course) {
        throw new HttpException(
          'You are not the course section owner. Access denied',
          HttpStatus.FORBIDDEN,
        );
      }
      return await this.sectionModel.updateOne(
        { _id: section_id },
        { $set: updateSectionDto },
      );
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //DELETE A SECTION
  async remove(section_id: string, user_id: string) {
    try {
      const faculty = await this.facultyModel.findOne({ user_id });
      const course = await this.courseModel.findOne({
        faculty: faculty._id,
        sections: section_id,
      });
      if (!course) {
        throw new HttpException(
          'You are not the course section owner. Access denied',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.courseModel.updateOne(
        { _id: course._id },
        {
          $pullAll: {
            sections: [section_id],
          },
        },
      );
      return await this.sectionModel.deleteOne({ _id: section_id });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }
}
