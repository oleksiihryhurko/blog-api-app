import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRequest } from '../decorators/user.decorator';
import { CreateUser, CreateUserDto } from './dto/create-user.dto';
import { LoginUser, LoginUserDto } from './dto/login-user.dto';
import { UpdateUser, UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';

@Controller()
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  public async createUser(
    @Body('user') createUser: CreateUser,
  ): Promise<UserResponseDto> {
    const user = await this.userService.createUser(createUser);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Authorization' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  public async login(
    @Body('user') loginUser: LoginUser,
  ): Promise<UserResponseDto> {
    const user = await this.userService.login(loginUser);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  async currentUser(@UserRequest('_id') _id: string): Promise<UserResponseDto> {
    const currentUser = await this.userService.getUserById(_id);
    return this.userService.buildUserResponse(currentUser);
  }

  @Put('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  async updateCurrentUser(
    @UserRequest('_id') _id: string,
    @Body('user') updateUser: UpdateUser,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.updateUserById(_id, updateUser);
    return this.userService.buildUserResponse(updatedUser);
  }
}
