import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { rating } from './types';
import { faculty } from 'src/faculties/type';
import { course } from 'src/courses/types';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel('rating') private ratingModel: Model<rating>,
    @InjectModel('faculty') private facultyModel: Model<faculty>,
    @InjectModel('course') private courseModel: Model<course>,
  ) {}

  //CREATE A NEW RATING
  async create(createRatingDto: CreateRatingDto, give_rating_to: string) {
    try {
      const check_ratings = await this.ratingModel.find({
        user: createRatingDto.user,
      });
      const check_ratings_ids = check_ratings.map((rating) => rating._id);
      if (check_ratings) {
        const check_faculty_rating = await this.facultyModel.findOne({
          _id: give_rating_to,
          ratings: { $in: check_ratings_ids },
        });
        if (check_faculty_rating) {
          throw new HttpException(
            'You already given a rating to this faculty',
            HttpStatus.CONFLICT,
          );
        } else {
          const check_course_rating = await this.courseModel.findOne({
            _id: give_rating_to,
            ratings: { $in: check_ratings_ids },
          });
          if (check_course_rating) {
            throw new HttpException(
              'You already given a rating to this course',
              HttpStatus.CONFLICT,
            );
          }
        }
      }
      const rating = new this.ratingModel(createRatingDto);
      const faculty = await this.facultyModel.findOne({ _id: give_rating_to });
      if (faculty) {
        await rating.save();
        await this.facultyModel.updateOne(
          { _id: give_rating_to },
          { $addToSet: { ratings: rating._id } },
        );
      } else {
        const course = await this.courseModel.findOne({ _id: give_rating_to });
        if (course) {
          await rating.save();
          await this.courseModel.updateOne(
            { _id: give_rating_to },
            { $addToSet: { ratings: rating._id } },
          );
        }
      }
      return rating;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET ALL NON-BLOCKED RATINGS
  async findAll() {
    try {
      return await this.ratingModel.find({status: 2});
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED RATING
  async findOne(rating_id: string) {
    try {
      return await this.ratingModel.findOne({ _id: rating_id, status: 2 });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //UPDATE A RATING
  async update(
    rating_id: string,
    updateRatingDto: UpdateRatingDto,
    user_id: string,
  ) {
    try {
      return await this.ratingModel.updateOne(
        { _id: rating_id, user: user_id },
        { $set: updateRatingDto },
      );
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //DELETE A RATING
  async remove(rating_id: string, user_id: string) {
    try {
      const faculty = await this.facultyModel.findOne({ ratings: rating_id });
      if (faculty) {
        await this.facultyModel.updateOne(
          { _id: faculty._id },
          { $pullAll: { ratings: [rating_id] } },
        );
      } else {
        const course = await this.courseModel.findOne({ ratings: rating_id });
        if (course) {
          await this.courseModel.updateOne(
            { _id: course._id },
            { $pullAll: { ratings: [rating_id] } },
          );
        }
      }
      return await this.ratingModel.deleteOne({
        _id: rating_id,
        user: user_id,
      });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }
}
