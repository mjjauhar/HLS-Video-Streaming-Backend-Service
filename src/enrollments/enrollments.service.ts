import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { student } from 'src/students/types';
import { enrollment } from './types';
import { course } from 'src/courses/types';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { faculty } from 'src/faculties/schema';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('student') private studentModel: Model<student>,
    @InjectModel('enrollment') private enrollmentModel: Model<enrollment>,
    @InjectModel('course') private courseModel: Model<course>,
    @InjectModel('faculty') private facultyModel: Model<faculty>,
    private readonly wishlistService: WishlistService,
    private readonly walletService: WalletService,
  ) {}

  //ENROLL IN A COURSE
  async enroll(
    createEnrollmentDto: CreateEnrollmentDto,
    loyalty_token: string,
  ) {
    // try {
    const student = await this.studentModel.findOne({
      user_id: createEnrollmentDto.student,
    });
    if (!student) {
      return new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    const check_purchase = await this.enrollmentModel.findOne({
      student: student._id,
      course: createEnrollmentDto.course,
    });
    if (check_purchase) {
      return new HttpException('Course already purchased', HttpStatus.CONFLICT);
    }
    const loyalty_api = this.configService.get<string>('LOYALTY_API');
    const course = await this.courseModel.findOne({
      _id: createEnrollmentDto.course,
    });
    const bodyFormData = {
      amount: course.price,
      reason: `Course: ${course.title}`,
      password: createEnrollmentDto.password,
      transaction_app: 'ADAM_EDUCATION',
    };
    try {
      const response = await axios.post(
        `${loyalty_api}/wallet/wallet-purchase`,
        bodyFormData,
        {
          headers: { Authorization: `Bearer ${loyalty_token}` },
        },
      );
      console.log(response.data.data.amount);
      this.walletService.addBalance(
        course.faculty.toString(),
        response.data.data.amount
        // response.data.data.amount,
      );
      console.log('course purchased data ^^^^^^^^^^^^^');
    } catch (error) {
      if (error.isAxiosError) {
        const axiosError = error;
        const responseError = axiosError.response?.data.data || 'Unknown error';
        throw new HttpException(
          responseError,
          axiosError.response.data.data.statusCode,
        );
      } else {
        throw new HttpException(error, 400, { cause: new Error(error) });
      }
    }
    const new_enrollment = new this.enrollmentModel({
      student: student._id,
      course: createEnrollmentDto.course,
    });

    await this.courseModel.updateOne(
      { _id: createEnrollmentDto.course },
      { $push: { students: student.user_id } },
    );
    const courseDetails = await this.courseModel.findOne({
      _id: createEnrollmentDto.course,
    });
    // console.log(courseDetails);
    await this.facultyModel.updateOne(
      { _id: courseDetails.faculty },
      { $push: { students: student.user_id.toString() } },
    );
    await this.wishlistService.removeFromWishList(
      student.user_id.toString(),
      createEnrollmentDto.course.toString(),
    );
    await this.studentModel.updateOne(
      { _id: student._id },
      { $set: { enrollments: new_enrollment._id } },
    );
    return await new_enrollment.save();
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }

  //GET ALL NON-BLOCKED ENROLLED COURSES
  async findAll(user_id: string) {
    try {
      const student = await this.studentModel.findOne({ user_id });
      return await this.enrollmentModel
        .find({ student: student._id, status: 2 })
        .populate({
          path: 'course',
          populate: [
            {
              path: 'faculty',
              populate: [
                { path: 'user_id', select: '-loyalty_id -roles' },
                { path: 'expertise' },
                { path: 'courses' },
                { path: 'ratings' },
              ],
            },
            {
              path: 'topic',
              populate: {
                path: 'sub_category',
                populate: { path: 'main_category' },
              },
            },
            {
              path: 'sections',
              populate: { path: 'lectures', populate: { path: 'video' } },
            },
            { path: 'ratings' },
          ],
        });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED ENROLLED COURSE
  async findOne(enrollment_id: string, user_id: string) {
    try {
      const student = await this.studentModel.findOne({ user_id });
      return await this.enrollmentModel
        .findOne({
          _id: enrollment_id,
          student: student._id,
          status: 2,
        })
        .populate({
          path: 'course',
          populate: [
            {
              path: 'faculty',
              populate: [
                { path: 'user_id', select: '-loyalty_id -roles' },
                { path: 'expertise' },
                { path: 'courses' },
                { path: 'ratings' },
              ],
            },
            {
              path: 'topic',
              populate: {
                path: 'sub_category',
                populate: { path: 'main_category' },
              },
            },
            {
              path: 'sections',
              populate: { path: 'lectures', populate: { path: 'video' } },
            },
            { path: 'ratings' },
          ],
        });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //TODO
  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  //TODO
  remove(id: string) {
    return `This action removes a #${id} enrollment`;
  }
}
