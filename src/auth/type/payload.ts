import { Types } from 'mongoose';
// import { Role } from 'src/roles/types/role';

export interface Payload {
  user_id: Types.ObjectId;
  email: string;
  roles: Types.ObjectId;
  loyalty_token: string;
}
