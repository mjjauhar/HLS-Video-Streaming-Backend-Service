import { Body, Controller, Get, Param, Patch, Req, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { user } from './types';
import { Roles } from 'src/roles/decorators';
import { Role } from 'src/roles/entity';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/user/:user_id')
  getUserData(@Param('user_id') user_id: string) {
    return this.usersService.getUserData(user_id);
  }

  @Get('profile')
  @Permissions(Permission.ACCESS_CONTENT)
  getUserProfile(@Req() request){
    return this.usersService.getUserProfile(request.user_id)
  }
}
