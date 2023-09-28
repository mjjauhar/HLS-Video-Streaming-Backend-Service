import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type AdminDocument = admin & Document;

@Schema()
export class admin {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    unique: true,
    ref: 'user',
  })
  user_id: Types.ObjectId;

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

export const admin_schema = SchemaFactory.createForClass(admin);
