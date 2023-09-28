import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type MainCategoryDocument = main_category & Document;

@Schema()
export class main_category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

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

export const main_category_schema = SchemaFactory.createForClass(main_category);
