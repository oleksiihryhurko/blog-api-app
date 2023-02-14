import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProfileModel } from '../schemas/profile.schema';

export class Profile extends PickType(ProfileModel, [
  'username',
  'bio',
  'image',
] as const) {
  @ApiProperty()
  readonly following: boolean;
}

export class ProfileResponseDto {
  @ApiProperty()
  readonly profile: Profile;
}
