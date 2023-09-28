import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type RatingDocument = rating & Document;

@Schema()
export class rating {
  @Prop({ required: true })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'user' })
  user: Types.ObjectId;

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

export const rating_schema = SchemaFactory.createForClass(rating);
