import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Permissions } from 'src/permissions/decorators';
import { Permission } from 'src/permissions/entity';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  //TEST EndPoint
  @Get('onlyAuth')
  //GAURD FOR PROTECTING ROUTES FOR AUTHENTICATED USERS ONLY
  @UseGuards(AuthGuard('jwt'))
  //USE PERMISSIONS (below) TO PROTECT ROUTES BASED ON USER PERMISSIONS.
  @Permissions(Permission.ENROLL_COURSES)
  async hiddenInformation(@Request() req: any) {
    console.log('req.user======>', req.user);
    return req.user;
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const result = await this.usersService.login(loginDTO);
    const payload = {
      user_id: result.user._id,
      // TODO: add username to payload
      email: result.user.email,
      roles: result.user.roles,
      loyalty_token: result.loyalty_token,
    };
    //TODO: const token = await this.authService.getToken(payload);
    const token = await this.authService.signPayload(payload);
    return { token, is_faculty: result.is_faculty };
  }
}
