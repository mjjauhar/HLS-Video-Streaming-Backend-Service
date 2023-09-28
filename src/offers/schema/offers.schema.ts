import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Offer {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  expiry: Date;

  @Prop({ required: true })
  start: Date;

  @Prop()
  contact:string;

  @Prop()
  url:string

  @Prop({ required: true, ref: 'OfferCategory',type:Types.ObjectId})
  category_id: Types.ObjectId;

  @Prop()
  image: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const offerSchema = SchemaFactory.createForClass(Offer);
