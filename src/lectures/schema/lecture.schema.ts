import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type LectureDocument = lecture & Document;

@Schema()
export class lecture {
  @Prop({ required: true })
  title: string;

  @Prop({default:"Video" })
  content: string;

  @Prop()
  duration: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'video' })
  video: Types.ObjectId;

  @Prop({type:String})
  thumbnail:string

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

export const lecture_schema = SchemaFactory.createForClass(lecture);
