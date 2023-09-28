import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { admin_schema } from './schema';
import { user_schema } from 'src/users/schema';
import { role_schema } from 'src/roles/schema';
import { faculty_schema } from 'src/faculties/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: user_schema },
      { name: 'role', schema: role_schema },
      { name: 'faculty', schema: faculty_schema },
      { name: 'admin', schema: admin_schema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
