import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User } from '../../users/users.schema';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): User | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // This is the full User document from JwtStrategy.validate()

    if (!user) {
      return null;
    }

    // If a specific property is requested, return just that property
    // Otherwise return the full user object
    return data ? user[data] : user;
  },
);

// Convenience decorator to get just the user ID as ObjectId
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ObjectId => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?._id;
  },
);