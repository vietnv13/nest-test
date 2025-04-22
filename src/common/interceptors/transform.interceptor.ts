import { CallHandler, ExecutionContext, NestInterceptor, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Response } from '~/common/model/response.model';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'undefined') {
          context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
          return data;
        }

        return new Response(HttpStatus.OK, data ?? null);
      }),
    );
  }
}
