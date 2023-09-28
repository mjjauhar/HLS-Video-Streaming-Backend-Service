import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { faculty_schema } from './schema';
import { AdminModule } from 'src/admin/admin.module';
import { walletSchema } from 'src/wallet/schema/wallet.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import { course_schema } from 'src/courses/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'faculty', schema: faculty_schema },
      { name: 'course', schema: course_schema },
    ]),
    AdminModule,
    WalletModule
  ],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
