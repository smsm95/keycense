import { Response } from 'express';
import standardResponse from './standardResponse';

class ErrorResponse extends Error {
  private statusCode: number;

  constructor(message: any, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
  send(res: Response) {
    standardResponse(res, this.statusCode, null, this, this.message, false);
  }
}

export default ErrorResponse;
