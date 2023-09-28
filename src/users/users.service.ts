import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO } from 'src/auth/dto';
import { Payload } from 'src/auth/type';
import { PopulatedUser, user } from './types';
import { role } from 'src/roles/types';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import jwtDecode from 'jwt-decode';
import { StudentsService } from 'src/students/students.service';
import { faculty } from 'src/faculties/schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private userModel: Model<user>,
    @InjectModel('role') private roleModel: Model<role>,
    @InjectModel('faculty') private facultyModel: Model<faculty>,
    private readonly configService: ConfigService,
    private studentsService: StudentsService,
  ) {}

  async login(loginDTO: LoginDTO) {
    try {
      const { email, password } = loginDTO;
      const loyalty_api = this.configService.get<string>('LOYALTY_API');
      const bodyFormData = { email: email, password: password };
      const response = await axios.post(
        `${loyalty_api}/auth/login`,
        bodyFormData,
      );
      // .catch((error) => {
      //   throw new HttpException(
      //     'Loyalty Service Error || ' + error.message,
      //     HttpStatus.INTERNAL_SERVER_ERROR,
      //   );
      // });

      const loyalty_token = response.data.data.tokens.access_token;
      const payload: { email: string; sub: string } = await jwtDecode(
        response.data.data.tokens.access_token,
      );
      const user = await this.userModel
        .findOne({ loyalty_id: payload.sub })
        .populate({
          path: 'roles',
          select: 'name -_id',
          populate: { path: 'permissions', select: 'name -_id' },
        });
      let is_faculty = false;

      if (!user || user === undefined || user === null) {
        try {
          const role = await this.roleModel.findOne({ name: 'Student' });
          const roleId = role._id;
          const username = response.data.data.username;
          await new this.userModel({
            email: payload.email,
            loyalty_id: payload.sub,
            username,
            roles: [roleId],
          }).save();

          const user = await this.userModel
            .findOne({ loyalty_id: payload.sub })
            .populate({
              path: 'roles',
              select: 'name -_id',
              populate: { path: 'permissions', select: 'name -_id' },
            });

          const new_user_id = user._id;
          await this.studentsService.create({ user_id: new_user_id });
          if (user.status === '0') {
            throw new HttpException(
              'This user account is blocked.',
              HttpStatus.UNAUTHORIZED,
            );
          }

          return { user, loyalty_token, is_faculty: is_faculty ? true : false };
        } catch (error) {
          throw new HttpException(error, 400, { cause: new Error(error) });
        }
      } else {
        if (user.status === '0') {
          throw new HttpException(
            'This user account is blocked.',
            HttpStatus.UNAUTHORIZED,
          );
        }
        is_faculty = await this.facultyModel.findOne({ user_id: user._id });
        return { user, loyalty_token, is_faculty: is_faculty ? true : false };
      }
    } catch (error) {
      console.log(error);

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
  }

  // return the object without password
  sanitizeUser(user: user) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findByPayload(payload: Payload): Promise<PopulatedUser> {
    const { user_id } = payload;
    return await this.userModel
      .findOne({ user_id })
      .populate({ path: 'roles', select: 'role_name' });
  }

  async getUserData(user_id: string) {
    const userData = await this.userModel.findOne({ user_id });
    if (!userData) {
      throw new HttpException('No user data found', HttpStatus.NOT_FOUND);
    }
    return userData;
  }

  async deleteUser(user_id: string) {
    const userData = await this.userModel.updateOne(
      { user_id },
      { $set: { $isDeleted: true } },
    );
    return userData;
  }

  async getUserProfile(user_id: string) {
    const userData = await this.userModel.findOne({ _id: user_id });
    const loyalty_api = this.configService.get<string>('LOYALTY_API');
    //  const response = await axios.post(`${loyalty_api}/user/single-user/`);
    return {
      image: null,
      username: userData.username,
      email: userData.email,
    };
  }
}
