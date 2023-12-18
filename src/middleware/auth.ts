import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import User from '../types/User';
import ErrorResponse from '../utils/errorResponse';
import { JsonDb } from '../utils/jsonDB';

const userDb = new JsonDb<User>('users.json');
const { UNAUTHORIZED, FORBIDDEN } = StatusCodes;

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return new ErrorResponse(
      'Unauthorized! Please login again',
      UNAUTHORIZED
    ).send(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    const user = await userDb.findOne({ id: decoded.id });

    if (!user) {
      return new ErrorResponse('Wrong credentials', UNAUTHORIZED).send(res);
    }

    req.user = user;
    next();
  } catch (err) {
    return new ErrorResponse('Not logged in', UNAUTHORIZED).send(res);
  }
};

export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return new ErrorResponse('Not authorized', FORBIDDEN).send(res);
    }
    next();
  };
};
