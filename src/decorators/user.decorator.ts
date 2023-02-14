import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserRequest = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
