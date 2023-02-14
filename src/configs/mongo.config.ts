import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: getMongoUri(configService),
  };
};

const getMongoUri = (configService: ConfigService) =>
  'mongodb://' +
  configService.get<string>('MONGO_LOGIN') +
  ':' +
  configService.get<string>('MONGO_PASSWORD') +
  '@' +
  configService.get<string>('MONGO_HOST') +
  ':' +
  configService.get<string>('MONGO_PORT') +
  '/' +
  configService.get<string>('MONGO_DATABASE');
