import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProfileModel,
  ProfileSchema,
} from 'src/profile/schemas/profile.schema';
import { getJwtConfig } from '../configs/jwt.config';
import { ProfileService } from '../profile/profile.service';
import { JwtStrategy } from '../user/strategies/jwt.strategy';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleModel, ArticleSchema } from './schemas/article.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: ArticleModel.name,
        schema: ArticleSchema,
        collection: 'articles',
      },
      {
        name: ProfileModel.name,
        schema: ProfileSchema,
        collection: 'profiles',
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ProfileService, JwtStrategy],
})
export class ArticleModule {}
