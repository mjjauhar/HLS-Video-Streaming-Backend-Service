import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
export type TopicDocument = topic & Document;

@Schema()
export class topic {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'sub_category', required: true })
  sub_category: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  status: string;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;

  @Prop({ required: true, default: '0.0.0.0' })
  ip_address: string;
}

export const topic_schema = SchemaFactory.createForClass(topic);
