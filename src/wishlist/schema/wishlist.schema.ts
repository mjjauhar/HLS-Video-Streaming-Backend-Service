import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
export type WishlistDocument = wishlist & Document;

@Schema()
export class wishlist {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'users', required: true })
  user_id: Types.ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'course' }])
  courses: Types.ObjectId[];
}

export const wishlist_schema = SchemaFactory.createForClass(wishlist);
