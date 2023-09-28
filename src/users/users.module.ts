import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { user_schema } from './schema';
import { UsersController } from './users.controller';
import { role_schema } from 'src/roles/schema';
import { HttpModule } from '@nestjs/axios';
import { StudentsModule } from 'src/students/students.module';
import { FacultiesModule } from 'src/faculties/faculties.module';
import { faculty_schema } from 'src/faculties/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: user_schema },
      { name: 'role', schema: role_schema },
      { name: 'faculty', schema: faculty_schema },
    ]),
    HttpModule,
    StudentsModule,
    FacultiesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
