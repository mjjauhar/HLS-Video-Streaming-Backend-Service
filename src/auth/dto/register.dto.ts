import { Types } from 'mongoose';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  roleId: Types.ObjectId;
}
