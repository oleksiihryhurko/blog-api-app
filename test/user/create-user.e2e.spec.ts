import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateUser } from '../../src/user/dto/create-user.dto';
import { Types, disconnect, Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import jwtDecode from 'jwt-decode';

describe('[E2E][User] Create', () => {
  let app: INestApplication;
  let db: Connection;

  const user: CreateUser = {
    username: 'create-user',
    email: 'create-user@test.com',
    password: 'test',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    db = module.get<Connection>(getConnectionToken());
    await app.init();
  });

  afterAll(async () => {
    await db.collection('users').findOneAndDelete({ email: user.email });
    disconnect();
  });

  test('with new email and username', async () => {
    const expectedResult = {
      email: user.email,
      username: user.username,
      bio: null,
      image: null,
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ user });
    expect(response.statusCode).toEqual(201);
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

  const ALREADY_EXISTING_SET = [
    ['email', user.email],
    ['username', user.username],
  ];

  test.each(ALREADY_EXISTING_SET)(
    'with already existing %s',
    async (attribute, value) => {
      const userWithAlreadyTakenData: CreateUser = {
        username: 'already-existing-user',
        email: 'already-existing-user@test.com',
        password: 'test',
      };
      userWithAlreadyTakenData[attribute] = value;
      const expectedResult = {
        entries: [attribute],
        message: 'entries are already taken',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ user: userWithAlreadyTakenData });

      expect(response.statusCode).toEqual(422);
      expect(response.body).toStrictEqual(expectedResult);
    },
  );

  const MISSING_VALUE_SET = [
    {
      attribute: 'username',
      errorMessage: ['username should not be empty'],
    },
    {
      attribute: 'email',
      errorMessage: ['email must be an email', 'email should not be empty'],
    },
    {
      attribute: 'password',
      errorMessage: ['password should not be empty'],
    },
  ];

  MISSING_VALUE_SET.forEach(({ attribute, errorMessage }) => {
    test(`with missing ${attribute}`, async () => {
      const userWithMissingValue: CreateUser = {
        username: 'missing-value-user',
        email: 'missing-value-user@test.com',
        password: 'test',
      };
      userWithMissingValue[attribute] = undefined;
      const expectedResult = {
        statusCode: 400,
        error: 'Bad Request',
        message: errorMessage,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ user: userWithMissingValue });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toStrictEqual(expectedResult);
    });
  });
});
