import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type CourseDocument = course & Document;

@Schema()
export class course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({})
  requirements: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'faculty', required: true })
  faculty: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'topic', required: true })
  topic: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({default:0})
  offer_price:number

  @Prop({ default: 0 })
  duration: number;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'section' }])
  sections: Types.ObjectId[];

  @Prop()
  thumbnail:string;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'student' }])
  students: Types.ObjectId[];

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'rating' }])
  ratings: Types.ObjectId[];

  @Prop({ required: true, default: 1 })
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  status: number;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;

  @Prop({ required: true, default: '0.0.0.0' })
  ip_address: string;
}

export const course_schema = SchemaFactory.createForClass(course);
