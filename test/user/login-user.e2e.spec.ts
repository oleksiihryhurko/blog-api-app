import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Types, disconnect, Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UserModel } from 'src/user/schemas/user.schema';
import { hash } from 'bcrypt';
import jwtDecode from 'jwt-decode';
import { LoginUser } from 'src/user/dto/login-user.dto';

describe('[E2E][User] Login', () => {
  let app: INestApplication;
  let db: Connection;

  const user: Omit<UserModel, '_id'> = {
    username: 'login-user',
    email: 'login-user@test.com',
    password: 'test',
    bio: 'test',
    image: 'test',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    db = module.get<Connection>(getConnectionToken());
    await app.init();
    const passwordHash = await hash(user.password, 10);
    await db.collection('users').insertOne({ ...user, password: passwordHash });
  });

  afterAll(async () => {
    await db.collection('users').findOneAndDelete({ email: user.email });
    disconnect();
  });

  test('with valid email and password', async () => {
    const requestBody: LoginUser = {
      email: user.email,
      password: user.password,
    };
    const expectedResult = {
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
    };

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ user: requestBody });
    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toBeDefined();
    const { token, ...body } = response.body.user;
    expect(body).toStrictEqual(expectedResult);

    const decodedToken = jwtDecode<{
      _id: string;
      email: string;
      username: string;
    }>(token);
    expect(Types.ObjectId.isValid(decodedToken._id)).toBeTruthy();
    expect(decodedToken.email).toEqual(user.email);
    expect(decodedToken.username).toEqual(user.username);
  });
});
