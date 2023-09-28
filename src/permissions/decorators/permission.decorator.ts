import { SetMetadata } from '@nestjs/common';
import { Permission } from '../entity/permission.entity';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
