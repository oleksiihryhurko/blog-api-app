import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ArticleDocument = ArticleModel & Document;

@Schema({ versionKey: false })
export class ArticleModel {
  _id: string;

  @Prop()
  author: string;

  @Prop()
  @ApiProperty()
  slug: string;

  @Prop()
  @ApiProperty()
  title: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  body: string;

  @Prop()
  @ApiProperty()
  tagList: Array<string>;

  @Prop()
  @ApiProperty()
  createdAt: Date;

  @Prop()
  @ApiProperty()
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(ArticleModel);
