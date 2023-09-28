import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Payload } from './type';
import { sign } from 'jsonwebtoken';
//TODO: import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    //TODO: private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  //SIGN USER INFO PAYLOAD TO JWT
  async signPayload(payload: Payload) {
    const secret_key = this.configService.get<string>('JWT_ACCESS_SECRET');
    return sign(payload, secret_key, { expiresIn: '7d' });
  }

  /*TODO: ADD REFRESH TOKEN
    async getToken(payload: Payload) {
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(
          payload, 
          {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'), 
            expiresIn: '15m',
          } 
        ),
        this.jwtService.signAsync(
          payload,
          {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
          }
        )
      ]);
  
      return {
        access_token,
        refresh_token,
      };
    }
  */
  async validateUser(payload: Payload) {
    return await this.usersService.findByPayload(payload);
  }
}

