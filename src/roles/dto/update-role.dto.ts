import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDTO } from './create-role.dto';
import { Types } from 'mongoose';

export class UpdateRoleDto extends PartialType(CreateRoleDTO) {
  permissions: Types.ObjectId;
}
