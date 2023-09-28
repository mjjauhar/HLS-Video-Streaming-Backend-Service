import { HttpException, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Model } from 'mongoose';
import { topic } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { course } from 'src/courses/types';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel('topic') private topicModel: Model<topic>,
    @InjectModel('course') private courseModel: Model<course>,
    ) {}
  async create(createTopicDto: CreateTopicDto) {
    const newTopic = new this.topicModel(createTopicDto);
    await newTopic.save();
    return newTopic;
  }

  async findAll() {
    return await this.topicModel.find().populate({
      path: 'sub_category',
      populate: { path: 'main_category' },
    });
  }

  async findAllCourses(topic_id: string) {
    try {
      const courses = await this.courseModel.find({ topic: topic_id }).populate({
        path: 'faculty',
        populate: [
          { path: 'user_id', select: 'username email _id' },
        ],
      })
        .populate({
          path: 'topic',
          select: 'name _id',
          populate: {
            path: 'sub_category', select: 'name _id',
            populate: { path: 'main_category', select: 'name _id' },
          },
        })
        .populate({
          path: 'sections', select: 'title duration updated_at',
          populate: {
            path: 'lectures', select: 'title duration updated_at',
            populate: { path: 'video', select: 'thumbnail title description' },
          },
        })
        .populate('ratings')
      return courses
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  async findOne(id: string) {
    return await this.topicModel.findOne({ _id: id }).populate({
      path: 'sub_category',
      populate: { path: 'main_category' },
    });
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    const updatedTopic = await this.topicModel.updateOne(
      { _id: id },
      { $set: updateTopicDto },
    );
    return updatedTopic;
  }

  async remove(id: string) {
    return await this.topicModel.deleteOne({ _id: id });
  }

}
