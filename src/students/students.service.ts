import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { student } from './types';

@Injectable()
export class StudentsService {
  constructor(@InjectModel('student') private studentModel: Model<student>) { }

  //CREATE A NEW STUDENT
  async create(createStudentDto: CreateStudentDto) {
    return await new this.studentModel({
      user_id: createStudentDto.user_id,
    }).save();
  }

  //GET ALL NON-BLOCKED STUDENTS
  async findAll() {
    return await this.studentModel.find({ status: 2 });
  }

  //GET A NON-BLOCKED STUDENT
  async findOne(student_id: string) {
    return await this.studentModel.findOne({ _id: student_id, status: 2 });
  }

  //UPDATE A STUDENT
  async update(student_id: string, updateStudentDto: UpdateStudentDto) {
    return await this.studentModel.updateOne(
      { _id: student_id },
      { $set: { updateStudentDto } },
    );
  }

  //DELETE A STUDENT
  async remove(student_id: string) {
    return await this.studentModel.deleteOne({ _id: student_id });
  }
}
