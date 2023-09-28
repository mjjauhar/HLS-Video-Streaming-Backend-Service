import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { admin } from './type';
import { user } from 'src/users/types';
import { role } from 'src/roles/types';
import { faculty } from 'src/faculties/type';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('user') private UserModel: Model<user>,
    @InjectModel('role') private RoleModel: Model<role>,
    @InjectModel('faculty') private FacultyModel: Model<faculty>,
    @InjectModel('admin') private adminModel: Model<admin>,
  ) { }

  //ADD NEW ADMIN
  async addAdmin(user_id: string) {
      const admin = await this.RoleModel.findOne({ name: 'Admin' });
      await this.UserModel.updateOne(
        { _id: user_id },
        { $addToSet: { roles: admin._id } },
      );
      return await new this.adminModel({ user_id }).save();
  }

  // BLOCK STUDENT
  async blockStudent(student_id: string) {
    // try {
      const role = await this.RoleModel.findOne({ name: 'Student' });
      const block_user = await this.UserModel.updateOne(
        { _id: student_id, roles: role._id },
        { $set: { status: 0 } },
      );
      return block_user;
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }

  //UNBLOCK STUDENT
  async unblockStudent(student_id: string) {
    // try {
      const role = await this.RoleModel.findOne({ name: 'Student' });
      const block_user = await this.UserModel.updateOne(
        { _id: student_id, roles: role._id },
        { $set: { status: 2 } },
      );
      return block_user;
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }

  //BLOCK FACULTY
  async blockFaculty(faculty_id: string) {
    // try {
      const role = await this.RoleModel.findOne({ name: 'Faculty' });
      const block_user = await this.UserModel.updateOne(
        { _id: faculty_id, roles: role._id },
        { $set: { status: 0 } },
      );
      return block_user;
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }

  //UNBLOCK FACULTY
  async unblockFaculty(faculty_id: string) {
    // try {
      const role = await this.RoleModel.findOne({ name: 'Faculty' });
      const block_user = await this.UserModel.updateOne(
        { _id: faculty_id, roles: role._id },
        { $set: { status: 2 } },
      );
      return block_user;
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }

  //APPROVE FACULTY
  async acceptFacultyApprovalRequest(
    user_id: string,
    admin_id: string,
  ) {
    // try {
      const user = await this.UserModel.findOne({ _id: user_id });
      if (!user) {
        throw new HttpException('Unknown User', HttpStatus.NOT_FOUND);
      }
      const admin = await this.adminModel.findOne({ user_id: admin_id });
      if (!admin) {
        throw new HttpException(
          'You are not an Admin',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const facultyRole = await this.RoleModel.findOne({ name: 'Faculty' });

      await this.UserModel.updateOne(
        {
          _id: user_id,
        },
        { $addToSet: { roles: facultyRole._id } },
      );
      return await this.FacultyModel.updateOne({ user_id }, { $set: { status: 2 } })
    // } catch (error) {
    //   throw new HttpException(error, 400, { cause: new Error(error.message) });
    // }
  }
}
