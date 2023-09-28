import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class wallet {
  @Prop({ required: true, ref: 'user', type: SchemaTypes.ObjectId })
  user_id: Types.ObjectId;

  @Prop()
  balance: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const walletSchema = SchemaFactory.createForClass(wallet);
