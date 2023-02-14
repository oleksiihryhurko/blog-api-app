import { HttpException, HttpStatus } from '@nestjs/common';

export class ProfileNotFoundException extends HttpException {
  constructor(username: string) {
    super(
      `profile with username: ${username} is not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
