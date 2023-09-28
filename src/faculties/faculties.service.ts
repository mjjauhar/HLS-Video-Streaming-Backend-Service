import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { faculty } from './schema';
import { WalletService } from 'src/wallet/wallet.service';
import { course } from 'src/courses/schema';
import { convertCourse, convertCourseForFaculty } from 'src/shared/helper';
// import { faculty } from './type';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel('faculty') private facultyModel: Model<faculty>,
    @InjectModel('course') private courseModel: Model<course>,
    private readonly walletService: WalletService,
  ) {}

  //CREATE A FACULTY WITH STATUS 1 (not approved)
  async create(user_id: string, expertise: string) {
    const alreadyFaculty = await this.facultyModel.findOne({
      user_id: user_id,
    });
    if (alreadyFaculty) {
      if (alreadyFaculty.status !== 2) {
        return { message: 'Already Request Sent' };
      } else {
        return { message: 'you are already a faculty' };
      }
    } else {
      const newFacultyData = {
        user_id: user_id,
        expertise: expertise,
        courses: [], // You can add courses, ratings, and students data if needed
        ratings: [],
        students: [],
      };
      await this.facultyModel.create(newFacultyData);
      return { message: 'request successfully sent' };
    }
  }

  //GET ALL FACULTIES
  async findAll() {
    return await this.facultyModel.find();
  }

  //GET A FACULTY
  async findOne(id: string) {
    return await this.facultyModel.findOne({ _id: id }).populate('ratings');
  }

  //UPDATE A FACULTY
  async update(id: string, updateFacultyDto: UpdateFacultyDto) {
    return await this.facultyModel.updateOne(
      { _id: id },
      { $set: { updateFacultyDto } },
    );
  }

  //DELETE A FACULTY
  async remove(id: string) {
    return await this.facultyModel.deleteOne({ _id: id });
  }

  async getFacultyRequests() {
    return await this.facultyModel.find({ status: 1 });
  }

  async getFacultyProfile(user_id: string) {
    const faculty: any = await this.facultyModel
      .findOne({ user_id: user_id })
      .populate({
        path: 'user_id', // Populate the 'user_id' field
        model: 'user', // Specify the model name to reference the 'user' model
        select: 'username', // Select the 'username' field from the 'user' model
      })
      // .populate({
      //   path: 'expertise',
      //   select: 'name',
      // })
      .select('-courses -ratings')
      .exec();

    const activeFacultyCourses: any = await this.courseModel
      .find({ status: 2, faculty: faculty._id })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username' }],
        select: '-courses -ratings -expertise -students',
      })
      .select('title description price thumbnail students')
      .populate('ratings');

    const coursesWithTotalRatings = activeFacultyCourses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;
      const formattedCourse = convertCourseForFaculty(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    const wallet_balance = await this.walletService.getWalletBalance(user_id);

    const formattedResponse = {
      _id: faculty._id,
      name: faculty.user_id.username,
      // expertise: faculty.expertise.name,
      number_of_students: faculty.students.length,
      active_course_number: activeFacultyCourses.length,
      wallet_balance: wallet_balance.balance,
      course_details: coursesWithTotalRatings,
    };
    return formattedResponse;
  }

  async getFacultyProfileForUser(faculty_id: string) {
    const faculty: any = await this.facultyModel
      .findOne({ _id: faculty_id })
      .populate({
        path: 'user_id', // Populate the 'user_id' field
        model: 'user', // Specify the model name to reference the 'user' model
        select: 'username', // Select the 'username' field from the 'user' model
      })
      // .populate({
      //   path: 'expertise',
      //   select: 'name',
      // })
      .select('-courses -ratings')
      .exec();

    const activeFacultyCourses: any = await this.courseModel
      .find({ status: 2, faculty: faculty_id })
      .populate({
        path: 'faculty',
        populate: [{ path: 'user_id', select: 'username' }],
        select: '-courses -ratings -expertise -students',
      })
      .select('title description price thumbnail students')
      .populate('ratings');

    const coursesWithTotalRatings = activeFacultyCourses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;
      const formattedCourse = convertCourseForFaculty(course);
      return {
        ...formattedCourse,
        total_ratings: totalRatings,
        average_rating: averageRating,
      };
    });

    const formattedResponse = {
      name: faculty.user_id.username,
      // expertise: faculty.expertise.name,
      number_of_students: faculty.students.length,
      active_course_number: activeFacultyCourses.length,
      course_details: coursesWithTotalRatings,
    };
    return formattedResponse;
  }

  async checkIfFaculty(user_id: string) {
    console.log(user_id);

    const faculty = await this.facultyModel.findOne({ user_id });

    if (faculty == undefined) {
      throw new ForbiddenException();
    } else {
      return true;
    }
  }
}
