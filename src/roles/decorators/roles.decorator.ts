import { SetMetadata } from '@nestjs/common';
import { Role } from '../entity/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
