import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/auth/interfaces/auth-request.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => { //here data means-> when i use @GetUser('sub')-> here data='sub'
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    return data ? user?.[data] : user;//if data exist='sub' exist=user?.['sub']=user.sub=request.user.sub
  },
);