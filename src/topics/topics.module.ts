import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { topic_schema } from './schema';
import { course_schema } from 'src/courses/schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'topic', schema: topic_schema },
        { name: 'course', schema: course_schema }
      ]
    ),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule { }
