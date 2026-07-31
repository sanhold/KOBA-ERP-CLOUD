import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || String(exception)
        : exception instanceof Error
        ? exception.message
        : 'An unexpected internal server error occurred';

    response.status(status).json({
      type: `https://koba.cloud/errors/http-${status}`,
      title: HttpStatus[status] || 'Error',
      status,
      detail: Array.isArray(message) ? message.join(', ') : message,
      instance: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
