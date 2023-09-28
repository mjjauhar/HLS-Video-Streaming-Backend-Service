import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { wishlist } from './schema/wishlist.schema';
import { Model } from 'mongoose';
import { convertCourse } from 'src/shared/helper';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(wishlist.name) private readonly wishlistModel: Model<wishlist>,
  ) {}

  async getWishlist(id: string) {
    try {
      const wishlist: any = await this.wishlistModel
      .findOne({ user_id: id })
      .populate({
        path: 'courses',
        model: 'course', // Specify the model name to reference the 'Course' model
        populate: [
          {
            path: 'faculty',
            populate: [
              { path: 'user_id', select: 'username' },
              // { path: 'expertise', select: 'name _id' },
            ],
            select: '-courses -ratings -expertise -students ',
          },
          {
            path: 'ratings',
          },
        ],
        select: '-requirements -topic -duration -sections', // Exclude the 'requirements' field from the populated 'courses'
      })
      .exec();
      
      if(wishlist?.courses === undefined || wishlist?.courses.length < 1){
        return {data:[],message:'No courses in wishlist'}
      }
      const courses = wishlist.courses;
    
    const coursesWithTotalRatings = courses.map((course) => {
      const totalRatings = course.ratings.length;
      const totalRatingValue = course.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;

        const formattedCourse = convertCourse(course);
        return {
          ...formattedCourse,
          total_ratings: totalRatings,
          average_rating: averageRating,
        };
    });

    return coursesWithTotalRatings;
    } catch (error) {
      console.log(error);
    }
  }

  async addToWishList(id: string, courseId: string) {
    const wishlist = await this.wishlistModel.findOne({ user_id: id });
    if (wishlist) {
      await this.wishlistModel.updateOne(
        { user_id: id },
        { $addToSet: { courses: courseId } },
      );
      return { message: 'course added to wishlist' };
    } else {
      await this.wishlistModel.create({ user_id: id, courses: [courseId] });
      return { message: 'course added to wishlist' };
    }
  }

  async removeFromWishList(id: string, courseId: string) {
    const wishlist = await this.wishlistModel.findOne({ user_id: id });
    if (wishlist) {
      await this.wishlistModel.updateOne(
        { user_id: id },
        { $pull: { courses: courseId } },
      );
      return { message: 'course removed from wishlist' };
    } else {
      return { message: 'no courses in wishlist' };
    }
  }

  async getWishlisted(user_id: string, course_id: string) {
    const wishlisted = await this.wishlistModel.exists({
      user_id: user_id,
      courses: { $elemMatch: { $eq: course_id } },
    });
    if (wishlisted) {
      return true;
    } else {
      return false;
    }
  }
}
