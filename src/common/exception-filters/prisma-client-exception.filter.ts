import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaClientErrorCode } from 'src/constants';

@Catch(Prisma.PrismaClientKnownRequestError)
export class CustomPrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly errorStatusMap: Record<string, number> = {
    [PrismaClientErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
    [PrismaClientErrorCode.CONFLICT]: HttpStatus.CONFLICT,
    [PrismaClientErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const modelName = exception.meta?.modelName || '';

    // render base on status code and model name
    const message = exception.message.replace(/\n/g, '');

    const statusCode = this.errorStatusMap[exception.code];

    if (statusCode) {
      response.status(statusCode).json({
        statusCode,
        message,
      });
    } else {
      // default 500 error code
      super.catch(exception, host);
    }
  }
}
