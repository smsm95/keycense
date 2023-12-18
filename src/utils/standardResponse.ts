import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const standardResponse = (
  res: Response,
  status: number = StatusCodes.OK,
  data: any = null,
  error: any = null,
  messages?: any,
  success: boolean = true
) => {
  res.status(status);
  const response: any = { status, success };
  if (data) {
    response.data = data;
    response.messages = Array.isArray(messages) ? messages : messages;
  }
  if (error) {
    switch (typeof error) {
      case 'string':
        response.errors = [{ message: error }];
        break;
      case 'object':
        response.errors = Array.isArray(error?.messages)
          ? error.messages.map((err: any) => generateErrorObject(err))
          : generateErrorObject(error);
        break;
      default:
        response.errors = [
          {
            message: 'Internal Server Error',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
          },
        ];
    }
  }
  res.json(response);
};
const generateErrorObject = (error: any) => {
  let mappedError: any = {
    message: typeof error === 'object' ? error.message : error,
    stack: process.env.NODE_ENV === 'production' ? null : error?.stack,
  };
  if (error?.field) {
    mappedError.field = error.field;
  }
  return mappedError;
};

export default standardResponse;
