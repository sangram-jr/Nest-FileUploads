import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { AuthRequest } from '../interfaces/auth-request.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => { //here data means-> when i use @GetUser('sub')-> here data='sub'
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    return data ? user?.[data] : user;//if data exist='sub' exist=user?.['sub']=user.sub=request.user.sub
  },
);