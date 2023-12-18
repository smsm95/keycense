import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/asyncHandler';
import AuthService from '../services/auth';
import ErrorResponse from '../utils/errorResponse';
import standardResponse from '../utils/standardResponse';

const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req);
      this.sendTokenResponse(user, OK, res);
    } catch (error: any) {
      console.error(error);
      new ErrorResponse('Failed to register user', INTERNAL_SERVER_ERROR).send(
        res
      );
    }
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await this.authService.login(req);
      if (!user) {
        return new ErrorResponse('User not found', NOT_FOUND).send(res);
      }
      this.sendTokenResponse(user, OK, res); // Implement sendTokenResponse function
    } catch (error: any) {
      console.error(error);
      new ErrorResponse('Failed to login user', INTERNAL_SERVER_ERROR).send(
        res
      );
    }
  });

  private sendTokenResponse = (
    user: any,
    statusCode: number,
    res: Response
  ) => {
    try {
      const token = this.getSignedJwtToken(user.id);
      const options: any = {};
      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }

      delete user.password;

      standardResponse(res, statusCode, {
        token,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  private getSignedJwtToken = (id: string) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpire = process.env.JWT_EXPIRE;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return jwt.sign({ id }, jwtSecret ?? '', {
      expiresIn: jwtExpire ?? '30d',
    });
  };
}
