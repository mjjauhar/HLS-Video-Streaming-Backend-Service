import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type EnrollmentDocument = enrollment & Document;

@Schema()
export class enrollment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'student', required: true })
  student: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'course', required: true })
  course: Types.ObjectId;

  @Prop({ default: Date.now })
  enrollment_date: Date;

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

export const enrollment_schema = SchemaFactory.createForClass(enrollment);
