import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { role_schema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'role', schema: role_schema }]),
    AuthModule,
  ],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
