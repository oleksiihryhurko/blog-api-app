import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({ versionKey: false })
export class UserModel {
  _id: string;

  @Prop({ unique: true })
  @ApiProperty()
  email: string;

  @Prop({ unique: true })
  @ApiProperty()
  username: string;

  @Prop({ default: null })
  @ApiProperty()
  bio: string;

  @Prop({ default: null })
  @ApiProperty()
  image: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
