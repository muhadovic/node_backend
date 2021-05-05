import { Request } from 'express';
import { HttpException, Logger } from '@nestjs/common';
import { CustomError } from '../interfaces/error.class';

export class ErrorHandlerHelper {
  public static errorHandler(error: CustomError, req: Request, message?: string): HttpException {
    Logger.error(`Method:${req.method + req.url}, ${error}`);
    return new HttpException({
      message: message ? `${message}` : `${error.message}`,
      status: error.status,
      errors: error,
    }, error.status);
  }
}

