import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type VideoDocument = video & Document;

@Schema()
export class video {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  url: string;
  
  @Prop()
  thumbnail: string;

  @Prop()
  folder_id: string;

  @Prop({ required: true, default: 0 })
  status: string;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;

  @Prop({ required: true, default: Date.now() })
  updated_at: Date;

  @Prop({ required: true, default: '0.0.0.0' })
  ip_address: string;
}

export const video_schema = SchemaFactory.createForClass(video);
