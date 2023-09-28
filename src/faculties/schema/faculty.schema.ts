import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class faculty {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'user',
  })
  user_id: Types.ObjectId;

  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   // required: true,
  //   ref: 'main_category',
  // })
  // expertise: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'course', required: true })
  courses: Types.ObjectId[];

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'rating' })
  ratings: Types.ObjectId[];

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'users' })
  students: Types.ObjectId[];

  // now i have set the faculty to be directly a faculty
  @Prop({ required: true, default: 2 })
  // 0 === failed/blocked, 1 === pending, 2 === success/unblocked
  status: number;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;

  @Prop({ required: true, default: '0.0.0.0' })
  ip_address: string;
}

export const faculty_schema = SchemaFactory.createForClass(faculty);
