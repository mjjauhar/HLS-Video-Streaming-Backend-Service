import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class student {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    unique: true,
    ref: 'user',
  })
  user_id: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'enrollment', required: true })
  enrollments: Types.ObjectId[];

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

export const student_schema = SchemaFactory.createForClass(student);
