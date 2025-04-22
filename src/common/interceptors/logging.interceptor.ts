import { CallHandler, ExecutionContext, NestInterceptor, Injectable, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name, { timestamp: false });

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    const content = `${request.method} -> ${request.url}`;
    const now = Date.now();

    this.logger.debug(`request: ${content}`);

    return call$.pipe(
      tap(() => {
        this.logger.debug(`response: ${content}${` +${Date.now() - now}ms`}`);
      }),
    );
  }
}
