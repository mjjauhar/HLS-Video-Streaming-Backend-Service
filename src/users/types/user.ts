import { Document, Types } from 'mongoose';
import { role } from 'src/roles/types/role';

export interface user extends Document {
  username: string;
  email: string;
  status: string;
  loyalty_id: Types.ObjectId;
  _id: Types.ObjectId;
  roles: Types.ObjectId;
}
export interface PopulatedUser extends Document {
  username: string;
  email: string;
  password: string;
  role: role[];
}
