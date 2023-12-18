import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorResponse from '../utils/errorResponse';

const { INTERNAL_SERVER_ERROR } = StatusCodes;

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  console.error(
    `Error occurred: ${err.name}, Status: ${err.statusCode}, Message: ${err.message}`
  );

  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    error.message = 'Internal Server Error';
  }

  const responseError = new ErrorResponse(
    error.message || 'Internal Server Error',
    error.statusCode || INTERNAL_SERVER_ERROR
  );

  responseError.send(res);
};

export default errorHandler;
