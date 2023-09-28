import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { course } from './types';
import { faculty } from 'src/faculties/type';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { WishlistService } from 'src/wishlist/wishlist.service';
import {
  convertCourse,
  convertSingleCourse,
  deleteFile,
} from 'src/shared/helper';
import * as fs from 'fs';
import { FacultiesService } from 'src/faculties/faculties.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('course') private courseModel: Model<course>,
    @InjectModel('faculty') private facultyModel: Model<faculty>,
    private readonly configService: ConfigService,
    private readonly wishlistService: WishlistService,
    private readonly facultyService: FacultiesService,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  // CREATE NEW COURSE
  async create(createCourseDto: CreateCourseDto, user_id: string) {
    // try {
    const faculty = await this.facultyModel.findOne({
      user_id: user_id,
    });
    if (!faculty) {
      throw new HttpException(
        'You are not a faculty. Access denied',
        HttpStatus.FORBIDDEN,
      );
    }
    createCourseDto.faculty = faculty._id;
    const createCourse = new this.courseModel(createCourseDto);
    await createCourse.save();

    const createdCourse = await this.courseModel.findOne({
      _id: createCourse._id,
    });
    await this.facultyModel.updateOne(
      { _id: faculty._id },
      { $addToSet: { courses: createdCourse._id } },
    );
    return createCourse;
    // } catch (error) {
    //   console.log(error);

    // }
  }

  //GET ALL NON-BLOCKED COURSES (WITH PAGINATION)
  async findAll(page: number, limit: number) {
    try {
      return await this.courseModel
        .find({ status: 2 })
        .populate({
          path: 'faculty',
          populate: [
            { path: 'user_id', select: 'username email _id' },
            // { path: 'expertise', select: 'name _id' },
          ],
          select: '-courses -ratings',
        })
        .populate('ratings')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .catch((err) => {
          throw new HttpException(err, 400, { cause: new Error(err.message) });
        });
    } catch (error) {
      return error;
    }
  }

  //GET A NON-BLOCKED COURSE
  async findOne(course_id: string, user_id: string) {
    const course: any = await this.courseModel
      .findOne({ status: 2, _id: course_id })
      .populate({
        path: 'faculty',
        populate: [
          { path: 'user_id', select: 'username email _id' },
          // { path: 'expertise', select: 'name _id description' },
          { path: 'ratings' },
        ],
        select: 'courses ratings students expertise',
      })
      .populate({
        path: 'topic',
      })
      .populate({
        path: 'sections',
        populate: { path: 'lectures', populate: { path: 'video' } },
      })
      .populate('ratings');

    if (course === undefined) {
      throw new NotFoundException();
    }

    const validFacultyCoures = await this.courseModel.find({
      status: 2,
      faculty: course.faculty._id,
    });

    const totalRatings = course.ratings.length;
    const totalRatingValue = course.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );
    const averageRating =
      totalRatings > 0 ? totalRatingValue / totalRatings : 0;
    let enrolledStudents = course.students.length;
    // if (enrolledStudents >= 1000) {
    //   enrolledStudents = Math.floor(enrolledStudents / 1000);
    // } else {
    //   enrolledStudents;
    // }

    let purchased = false;
    purchased = course.students.find((user) => user.toString() === user_id);
    const wishlisted = await this.wishlistService.getWishlisted(
      user_id,
      course_id,
    );

    const facultyTotalRatings = course.faculty.ratings.length;
    const facultyTotalRatingValue = course.faculty.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0,
    );

    const facultyAverageRating =
      facultyTotalRatings > 0
        ? facultyTotalRatingValue / facultyTotalRatings
        : 0;

    const formattedResponse = convertSingleCourse(
      course,
      validFacultyCoures,
      facultyAverageRating,
      totalRatings,
      averageRating,
      enrolledStudents,
      purchased,
      wishlisted,
    );

    return formattedResponse;
  }

  //PUBLISH A COURSE
  async publish(course_id: string, loyalty_token: string) {
    try {
      const published = await this.courseModel.updateOne(
        { _id: course_id },
        { $set: { status: 2 } },
      );
      const course: any = await this.courseModel
        .findOne({ _id: course_id })
        .populate({
          path: 'sections',
          populate: { path: 'lectures', populate: { path: 'video' } },
        })
        .populate({
          path: 'topic',
          populate: {
            path: 'sub_category',
            populate: { path: 'main_category' },
          },
        });

      const data = {
        name: course.title,
        description: course.description,
        app: 'ADAM_EDUCATION',
        image: course.thumbnail,
      };
      await axios.post(
        `${this.configService.get<string>('LOYALTY_API')}/new-offer/add`,
        data,
        {
          headers: { Authorization: `Bearer ${loyalty_token}` },
        },
      );

      return { message: 'course published' };
    } catch (error) {
      console.log(error);

      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //UPDATE A COURSE
  async update(
    course_id: string,
    user_id: string,
    updateCourseDto: UpdateCourseDto,
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
      const updatedCourse = await this.courseModel
        .updateOne(
          { _id: course_id, faculty: faculty._id },
          { $set: updateCourseDto },
        )
        .catch((error) => {
          throw new HttpException(error, 400, {
            cause: new Error(error.message),
          });
        });
      return updatedCourse;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //DELETE A COURSE
  async remove(course_id: string, user_id: string) {
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
      //TODO: also delete corresponding sections and lectures of this course from database
      //TODO: soft delete. change status to 0. Only Auto delete after few days or Admin delete completely from database.
      // const deletedCourse = await this.courseModel.deleteOne({
      //   _id: course_id,
      //   faculty: faculty._id,
      // });
      // return deletedCourse;
      const course = await this.courseModel.findOne({ _id: course_id });
      await this.courseModel.updateOne(
        { _id: course_id },
        { $set: { status: 0 } },
      );
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET LATEST COURSE
  async getLatestCourses() {
    const courses: any = await this.courseModel
      .find({ status: 2 })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username' }],
        select: '-courses -ratings -expertise -students',
      })
      // .select('-duration -sections -ratings -topic -requirements -ratings ')
      .select('title description price thumbnail students')
      .populate('ratings')
      .sort({ created_at: -1 })
      .limit(10);

    // Calculate the total count of ratings and average rating for each course
    const coursesWithTotalRatings = courses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;
      const formattedCourse = convertCourse(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    return coursesWithTotalRatings;
  }

  async getPopularCourses() {
    const courses: any = await this.courseModel
      .find({ status: 2 })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username ' }],
        select: '-courses -ratings -expertise -students',
      })
      // .select('-duration -sections -ratings -topic -requirements -ratings ')
      .select('title description price thumbnail students')
      .populate('ratings');

    courses.sort((a, b) => b.students.length - a.students.length);

    // Get only the first 10 courses with the most students
    const topTenCoursesWithMostStudents = courses.slice(0, 10);

    const coursesWithTotalRatings = topTenCoursesWithMostStudents.map(
      (course) => {
        const totalRatings = course.ratings.length;
        const totalRatingValue = course.ratings.reduce(
          (sum, rating) => sum + rating.rating,
          0,
        );
        const averageRating =
          totalRatings > 0 ? totalRatingValue / totalRatings : 0;

        const formattedCourse = convertCourse(course);
        return {
          ...formattedCourse,
          total_ratings: totalRatings,
          average_rating: averageRating,
        };
      },
    );

    return coursesWithTotalRatings;
  }

  async searchCourse(keyword) {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexSearch = new RegExp(escapedKeyword, 'i');

    const courses: any = await this.courseModel
      .find({
        status: 2,
        $or: [
          { title: { $regex: regexSearch } },
          { description: { $regex: regexSearch } },
        ],
      })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username ' }],
        select: '-courses -ratings -expertise -students',
      })
      // .select('-duration -sections -ratings -topic -requirements ')
      .select('title description price thumbnail students')
      .populate('ratings')
      .sort({ created_at: -1 })
      .limit(10);

    // Calculate the total count of ratings and average rating for each course
    const coursesWithTotalRatings = courses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;
      const formattedCourse = convertCourse(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    return coursesWithTotalRatings;
  }

  async addThumbnail(course_id: string, file: string) {
    try {
      const bucket_name = this.configService.get<string>('AWS_S3_BUCKET');
      const aws_s3_folder_path =
        this.configService.get<string>('AWS_S3_FOLDER_PATH');
      const folder_path = `${aws_s3_folder_path}/${course_id}`;

      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: bucket_name,
        Key: `${folder_path}/${file}`,
        Body: createReadStream(`temp/thumbnail/` + file),
      });

      await this.s3Client.send(command);

      const thumbnail_url = `https://${bucket_name}.s3.ap-south-1.amazonaws.com/${folder_path}/${file}`;
      // fs.unlinkSync(file)
      await this.courseModel.updateOne(
        { _id: course_id },
        { $set: { thumbnail: thumbnail_url } },
      );
      return { message: 'successfully added thumbnail' };
    } catch (error) {
      throw new HttpException(error, 400, {
        cause: new Error(error.message),
      });
    }
  }

  async getCoursesByTopic(id: string) {
    const courses: any = await this.courseModel
      .find({ status: 2, topic: id })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username' }],
        select: '-courses -ratings -expertise -students',
      })
      // .select('-duration -sections -ratings -topic -requirements -ratings ')
      .select('title description price thumbnail students')
      .populate('ratings')
      .sort({ created_at: -1 })
      .limit(10);

    // Calculate the total count of ratings and average rating for each course
    const coursesWithTotalRatings = courses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;

      const formattedCourse = convertCourse(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    return coursesWithTotalRatings;
  }

  async getMyLearning(user) {
    const coursesWithCurrentUser: any = await this.courseModel
      .find({ status: 2, students: { $in: [user] } })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username ' }],
        select: '-courses -ratings -expertise -students',
      })
      // .select('-duration -sections -ratings -topic -requirements -ratings')
      .select('title description price thumbnail students')
      .populate('ratings')
      .exec();

    const coursesWithTotalRatings = coursesWithCurrentUser.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;

      const formattedCourse = convertCourse(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    if (coursesWithCurrentUser.length < 1) {
      return { message: 'No courses currently purchased' };
    } else {
      return coursesWithTotalRatings;
    }
  }

  async getCourseLectures(user_id: string, course_id: string) {
    const course: any = await this.courseModel
      .findOne({ _id: course_id, status: 2 })
      .populate({
        path: 'faculty',
        populate: [
          { path: 'user_id', select: 'username' },
          // { path: 'expertise' },
        ],
        select: '_id',
      })
      .populate({
        path: 'topic',
        select: 'name',
        // populate: {
        //   path: 'sub_category',
        //   populate: { path: 'main_category' },
        // },
      })
      .populate({
        path: 'sections',
        populate: { path: 'lectures', populate: { path: 'video' } },
      })
      .select('title description price thumbnail students')
      .exec();

    const purchased = course.students.find((m) => m.toString() === user_id);
    if (purchased === undefined) {
      return { message: "You haven't purchased the course" };
    }
    return course;
  }
}
