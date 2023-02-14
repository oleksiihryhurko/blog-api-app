import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserModel } from '../schemas/user.schema';

class User extends PickType(UserModel, [
  'email',
  'username',
  'bio',
  'image',
] as const) {
  @ApiProperty()
  readonly token: string;
}

export class UserResponseDto {
  @ApiProperty()
  readonly user: User;
}
