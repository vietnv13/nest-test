import { ArgumentsHost, ExceptionFilter, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';

import { ErrorEnum } from '~/common/constants/error-code.constant';
import { CustomHttpException } from '~/common/exceptions/http.exception';
import { isDev } from '~/utils';

interface MyError {
  readonly status: number;
  readonly statusCode?: number;
  readonly message?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor() {
    this.registerCatchAllExceptionsHook();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    const url = request.raw.url!;

    const status = this.getStatus(exception);
    let message = this.getErrorMessage(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR && !(exception instanceof CustomHttpException)) {
      Logger.error(exception, undefined, 'Catch');

      if (!isDev) {
        message = ErrorEnum.SERVER_ERROR?.split(':')[1];
      }
    } else {
      this.logger.warn(`Other: (${status}) ${message} Path: ${decodeURI(url)}`);
    }

    const apiErrorCode = exception instanceof CustomHttpException ? exception.getErrorCode() : status;

    const resBody: BaseResponseInterface = {
      code: apiErrorCode,
      message,
      data: null,
    };

    response.status(status).send(resBody);
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    } else {
      return (exception as MyError)?.status ?? (exception as MyError)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    } else {
      return (exception as any)?.response?.message ?? (exception as MyError)?.message ?? `${exception}`;
    }
  }

  registerCatchAllExceptionsHook() {
    process.on('unhandledRejection', (reason) => {
      console.error('unhandledRejection: ', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('uncaughtException: ', err);
    });
  }
}
