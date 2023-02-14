import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop()
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
