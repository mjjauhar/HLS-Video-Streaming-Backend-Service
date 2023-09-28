import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { enrollment_schema } from './schema';
import { student_schema } from 'src/students/schema';
import { course_schema } from 'src/courses/schema';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { faculty_schema } from 'src/faculties/schema';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'enrollment', schema: enrollment_schema },
      { name: 'student', schema: student_schema },
      { name: 'course', schema: course_schema },
      { name: 'faculty', schema: faculty_schema },
    ]),
    WishlistModule,
    WalletModule
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
