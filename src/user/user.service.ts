import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUser } from './dto/create-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEvents, QueueNames } from 'src/common/enum/queue.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: Model<UserDocument>,
    @InjectQueue(QueueNames.Users)
    private userQueue: Queue,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUser: CreateUser): Promise<UserModel> {
    await this.checkForExistingValue(createUser.email, createUser.username);
    const passwordHash = await hash(createUser.password, 10);
    const newUser = new this.userModel({
      email: createUser.email,
      username: createUser.username,
      password: passwordHash,
    });
    const user = await newUser.save();
    user.password = undefined;
    await this.userQueue.add(QueueEvents.UserUpdated, {
      username: user.username,
      bio: user.bio,
      image: user.image,
    });
    return user.toObject();
  }

  async login(loginUser: LoginUser): Promise<UserModel> {
    return this.validateUser(loginUser);
  }

  async validateUser(loginUser: LoginUser): Promise<UserModel> {
    const user = await this.userModel.findOne({ email: loginUser.email });
    if (!user) {
      throw new HttpException(
        'email is not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await compare(loginUser.password, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException(
        'password is not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user.toObject();
  }

  async updateUserById(
    _id: string,
    updateUser: UpdateUser,
  ): Promise<UserModel> {
    await this.checkForExistingValue(updateUser.email, updateUser.username);
    const user = await this.userModel
      .findByIdAndUpdate<UserModel>(new Types.ObjectId(_id), updateUser, {
        overwrite: false,
        lean: true,
        returnDocument: 'after',
      })
      .select({ password: 0 });
    await this.userQueue.add(QueueEvents.UserUpdated, {
      username: user.username,
      bio: user.bio,
      image: user.image,
    });
    return user;
  }

  async getUserById(id: string): Promise<UserModel> {
    const user = await this.userModel
      .findById(new Types.ObjectId(id))
      .select({ password: 0 });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return user.toObject();
  }

  async getUserByUserName(username: string): Promise<UserModel> {
    const user = await this.userModel
      .findOne({ username })
      .select({ password: 0 });
    if (!user) {
      throw new HttpException(
        `user with username: ${username} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user.toObject();
  }

  async buildUserResponse(user: UserModel): Promise<UserResponseDto> {
    return {
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: await this.generateJwtToken(user),
      },
    };
  }

  private async checkForExistingValue(email: string, username: string) {
    const existingEntries = [];

    const existingUserByEmail = await this.userModel.count({ email });
    if (existingUserByEmail) existingEntries.push('email');

    const existingUserByUsername = await this.userModel.count({ username });
    if (existingUserByUsername) existingEntries.push('username');

    if (existingEntries.length) {
      throw new HttpException(
        {
          entries: existingEntries,
          message: 'entries are already taken',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private async generateJwtToken(user: UserModel): Promise<string> {
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
    return await this.jwtService.signAsync(payload);
  }
}
