import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type SectionDocument = section & Document;

@Schema()
export class section {
  @Prop({ required: true })
  title: string;

  @Prop({  })
  duration: number;

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'lecture' }])
  lectures: Types.ObjectId[];

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

export const section_schema = SchemaFactory.createForClass(section);
