import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/user/schemas/user.schema';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { ProfileModel, ProfileDocument } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { ProfileNotFoundException } from 'src/common/exceptions/profile.exception';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async getProfileByUsername(username: string): Promise<ProfileModel> {
    const profile = await this.profileModel.findOne<ProfileModel>(
      { username },
      null,
      { lean: true },
    );
    if (!profile) {
      throw new ProfileNotFoundException(username);
    }
    return profile;
  }

  isFollowing(user: UserModel, profile: ProfileModel): boolean {
    return profile.followers.includes(user.username);
  }

  async followProfile(
    user: UserModel,
    profile: ProfileModel,
  ): Promise<boolean> {
    const isFollowing = this.isFollowing(user, profile);

    if (!isFollowing) {
      const followerProfile = await this.profileModel.findOneAndUpdate(
        { username: user.username },
        { $addToSet: { following: profile.username } },
        { overwrite: false, lean: true, returnDocument: 'after' },
      );

      const followingProfile = await this.profileModel.findOneAndUpdate(
        { username: profile.username },
        { $addToSet: { followers: user.username } },
        { overwrite: false, lean: true, returnDocument: 'after' },
      );
      if (
        !followerProfile.following.includes(profile.username) ||
        !followingProfile.followers.includes(user.username)
      ) {
        return false;
      }
    }
    return true;
  }

  async unfollowProfile(
    user: UserModel,
    profile: ProfileModel,
  ): Promise<boolean> {
    const isFollowing = this.isFollowing(user, profile);

    if (isFollowing) {
      const followerProfile = await this.profileModel.findOneAndUpdate(
        { username: user.username },
        { $pull: { following: profile.username } },
        { overwrite: false, lean: true, returnDocument: 'after' },
      );

      const followingProfile = await this.profileModel.findOneAndUpdate(
        { username: profile.username },
        { $pull: { followers: user.username } },
        { overwrite: false, lean: true, returnDocument: 'after' },
      );
      if (
        followerProfile.following.includes(profile.username) ||
        followingProfile.followers.includes(user.username)
      ) {
        return true;
      }
    }
    return false;
  }

  buildProfileResponse(
    profile: ProfileModel,
    isFollowing: boolean,
  ): ProfileResponseDto {
    return {
      profile: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: isFollowing,
      },
    };
  }
}
