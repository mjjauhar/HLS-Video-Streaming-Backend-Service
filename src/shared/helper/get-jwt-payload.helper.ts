import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import jwtDecode from 'jwt-decode';

export function GetJwtPayload(context: ExecutionContext) {
  const req = context.switchToHttp().getRequest();

  if (!req || !req.headers || !req.headers.authorization) {
    throw new HttpException('Authentication required', HttpStatus.UNAUTHORIZED);
  }

  const token = req.headers.authorization.slice(7);
  const payload = jwtDecode(token);
  req.user_id = payload['user_id'];
  return payload;
}
