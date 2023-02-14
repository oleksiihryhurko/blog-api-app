import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { disconnect, Connection } from 'mongoose';
import { ObjectId } from 'bson';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';

describe('[E2E][TAG] Get', () => {
  let app: INestApplication;
  let db: Connection;

  let insertedTagId: ObjectId;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    db = module.get<Connection>(getConnectionToken());
    await app.init();

    const { insertedId } = await db
      .collection('tags')
      .insertOne({ name: 'test' });
    insertedTagId = insertedId;
  });

  afterAll(async () => {
    await db.collection('tags').findOneAndDelete({ _id: insertedTagId });
    disconnect();
  });

  test('all tags', async () => {
    const response = await request(app.getHttpServer()).get('/tags');
    expect(response.status).toEqual(200);
    expect(response.body).toStrictEqual({ tags: ['test'] });
  });
});
