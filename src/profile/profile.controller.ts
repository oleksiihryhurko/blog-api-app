import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserModel } from 'src/user/schemas/user.schema';
import { UserRequest } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileService } from './profile.service';

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  async getProfile(
    @UserRequest() user: UserModel,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfileByUsername(username);
    const isFollow = this.profileService.isFollowing(user, profile);
    return this.profileService.buildProfileResponse(profile, isFollow);
  }

  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow user profile' })
  @ApiCreatedResponse({ type: ProfileResponseDto })
  async followProfile(
    @UserRequest() user: UserModel,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfileByUsername(username);
    const isFollow = await this.profileService.followProfile(user, profile);
    return this.profileService.buildProfileResponse(profile, isFollow);
  }

  @Delete(':username/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow user profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  async unfollowProfile(
    @UserRequest() user: UserModel,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfileByUsername(username);
    const isFollow = await this.profileService.unfollowProfile(user, profile);
    return this.profileService.buildProfileResponse(profile, isFollow);
  }
}
