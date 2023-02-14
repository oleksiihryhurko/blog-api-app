import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ProfileDocument = ProfileModel & Document;

@Schema({ versionKey: false })
export class ProfileModel {
  _id: string;

  @Prop()
  @ApiProperty()
  username: string;

  @Prop()
  @ApiProperty()
  bio: string;

  @Prop()
  @ApiProperty()
  image: string;

  @Prop()
  @ApiProperty()
  followers: Array<string>;

  @Prop()
  @ApiProperty()
  following: Array<string>;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileModel);
