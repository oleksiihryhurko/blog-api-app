import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueNames } from 'src/common/enum/queue.enum';
import { getJwtConfig } from '../configs/jwt.config';
import { UserModel, UserSchema } from '../user/schemas/user.schema';
import { JwtStrategy } from '../user/strategies/jwt.strategy';
import { UserService } from '../user/user.service';
import { ProfileController } from './profile.controller';
import { ProfileProcessor } from './profile.processor';
import { ProfileService } from './profile.service';
import { ProfileModel, ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
        collection: 'users',
      },
      {
        name: ProfileModel.name,
        schema: ProfileSchema,
        collection: 'profiles',
      },
    ]),
    BullModule.registerQueue({
      name: QueueNames.Users,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, JwtStrategy, ProfileProcessor],
})
export class ProfileModule {}
