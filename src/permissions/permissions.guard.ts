import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Permission } from './entity';
import { GetJwtPayload } from 'src/shared/helper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const payload = GetJwtPayload(context);
    const roles = payload['roles'];
    const user_permissions = [];
    roles.map((role: { permissions: any }) =>
      role.permissions.map((permission: { name: any }) =>
        user_permissions.push(permission.name),
      ),
    );
    const result = user_permissions.some((permission) =>
      requiredPermissions.includes(permission),
    );
    return result;
  }
}
