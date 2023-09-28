import { HttpException, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './types';
import { topic } from 'src/topics/types';
import { course } from 'src/courses/types';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel('sub_category') private subCategoryModel: Model<SubCategory>,
    @InjectModel('topic') private topicModel: Model<topic>,
    @InjectModel('course') private courseModel: Model<course>,
  ) { }
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const newSubCategory = new this.subCategoryModel(createSubCategoryDto);
    await newSubCategory.save();
    return newSubCategory;
  }

  async findAll() {
    return await this.subCategoryModel.find().populate({
      path: 'main_category',
    });
  }

  async findAllCourses(sub_category_id: string) {
    try {
      const topics = await this.topicModel.find({ sub_category: sub_category_id })
      const topic_ids = topics.map((topic) => topic._id)
      const courses = await this.courseModel.find({ topic: topic_ids }).populate({
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
    return await this.subCategoryModel.findOne({ _id: id }).populate({
      path: 'main_category',
    });
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const updatedSubCategory = await this.subCategoryModel.updateOne(
      { _id: id },
      { $set: updateSubCategoryDto },
    );
    return updatedSubCategory;
  }

  async remove(id: string) {
    return await this.subCategoryModel.deleteOne({ _id: id });
  }
}
