import { InjectModel } from '@nestjs/mongoose';
import { CreateMainCategoryDto } from './dto/create-main-category.dto';
import { UpdateMainCategoryDto } from './dto/update-main-category.dto';
import { main_category } from './types';
import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { SubCategory } from 'src/sub-categories/types';
import { topic } from 'src/topics/types';
import { course } from 'src/courses/types';

@Injectable()
export class MainCategoriesService {
  constructor(
    @InjectModel('main_category')
    private mainCategoryModel: Model<main_category>,
    @InjectModel('sub_category') private subCategoryModel: Model<SubCategory>,
    @InjectModel('topic') private topicModel: Model<topic>,
    @InjectModel('course') private courseModel: Model<course>,
  ) {}

  //CREATE NEW MAIN CATEGORY
  async create(createMainCategoryDto: CreateMainCategoryDto) {
    const newMainCategory = new this.mainCategoryModel(createMainCategoryDto);
    return await newMainCategory.save();
  }

  //GET ALL NON-BLOCKED MAIN CATEGORIES
  async findAll() {
    return await this.mainCategoryModel.find({ status: 2 });
  }

  //GET ALL NON-BLOCKED COURSES UNDER A MAIN CATEGORY
  async findAllCourses(main_category_id: string) {
    try {
      const sub_categories = await this.subCategoryModel.find({
        main_category: main_category_id,
      });
      const sub_categories_id = sub_categories.map(
        (sub_category) => sub_category._id,
      );
      const topics = await this.topicModel.find({
        sub_category: sub_categories_id,
      });
      const topics_id = topics.map((topic) => topic._id);
      const courses = await this.courseModel
        .find({ topic: topics_id, status: 2 })
        .populate({
          path: 'faculty',
          populate: [{ path: 'user_id', select: 'username email _id' }],
        })
        .populate({
          path: 'topic',
          select: 'name _id',
          populate: {
            path: 'sub_category',
            select: 'name _id',
            populate: { path: 'main_category', select: 'name _id' },
          },
        })
        .populate({
          path: 'sections',
          select: 'title duration updated_at',
          populate: {
            path: 'lectures',
            select: 'title duration updated_at',
            populate: { path: 'video', select: 'thumbnail title description' },
          },
        })
        .populate('ratings');
      return courses;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error.message) });
    }
  }

  //GET A NON-BLOCKED MAIN CATEGORY
  async findOne(main_category_id: string) {
    return await this.mainCategoryModel.findOne({
      _id: main_category_id,
      status: 2,
    });
  }

  //UPDATE A MAIN CATEGORY
  async update(
    main_category_id: string,
    updateMainCategoryDto: UpdateMainCategoryDto,
  ) {
    const updatedMainCategory = await this.mainCategoryModel.updateOne(
      { _id: main_category_id },
      { $set: updateMainCategoryDto },
    );
    return updatedMainCategory;
  }

  //DELETE A MAIN CATEGORY
  async remove(main_category_id: string) {
    return await this.mainCategoryModel.deleteOne({ _id: main_category_id });
  }

  async getTopics(id: string) {
    const sub_categories = await this.subCategoryModel.find({
      main_category: id,
    });
    const categories = sub_categories.map((m) => m._id.toString());
    const topics = await this.topicModel
      .find({ sub_category: { $in: categories } })
      .exec();
    return topics;
  }
}
