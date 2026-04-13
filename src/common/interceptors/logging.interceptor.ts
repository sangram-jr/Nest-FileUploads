import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>(); //get the request
    const method = req.method;
    const url = req.url;

    const start = Date.now();

    return next.handle().pipe(     //return next.handle=Continue request → go to controller → service → return response 
      tap(() => {                   // .pipe.tap() =when response comes, again interceptor runs
        const time = Date.now() - start;
        console.log(`${method} ${url} - ${time}ms`);
      }),
    );
  }
}